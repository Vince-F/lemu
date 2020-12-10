import { app, BrowserWindow, Menu, protocol } from 'electron';
import { autoUpdater } from "electron-updater";

import path = require("path");
import "v8-compile-cache";

import "./eventBuses";
import { BrowserWindowManager } from './controllers/browserWindowManager';

try {
  autoUpdater.checkForUpdatesAndNotify();
} catch (e) {
  console.log("Fail to check for updates");
}

let mainWindow: Electron.BrowserWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 0,
    height: 0,
    icon: path.join(__dirname, "../../icon.png"),
    webPreferences: {
      nodeIntegration: false,
      webSecurity: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js")
    },
    backgroundColor: "#fafafa"
  });
  mainWindow.maximize();
  BrowserWindowManager.setInstance(mainWindow);
  if (app.isPackaged) {
    mainWindow.loadFile('./dist-app/index.html');
    Menu.setApplicationMenu(null);
  } else {
    mainWindow.loadURL("http://localhost:8080");
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function registerDocProtocol() {
  const successfull = protocol.registerFileProtocol('doc', (request, callback) => {
    let url = request.url.substr("doc://".length);
    url = url.replace("-/", "");
    // because vuepress uses HTML5 history mode, current page gets in the way
    // for now we get rid of it the stupid way
    url = url.replace("guide/", "");
    if (url.endsWith("/") || url === "") {
      url += "index.html";
    }
    console.log("request url from doc is", url);
    callback({ path: path.normalize(`./dist-app/docs/${url}`) });
  });
  if (!successfull) {
    console.error("Fail to register doc protocol");
  }
}

protocol.registerSchemesAsPrivileged([
  { scheme: 'doc', privileges: { secure: true, standard: true } }
]);

// for notification
app.setAppUserModelId(process.execPath);
app.commandLine.appendSwitch("disable-site-isolation-trials");

app.on('ready', () => {
  registerDocProtocol();
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
