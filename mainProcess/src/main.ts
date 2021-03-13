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

let mainWindow: Electron.BrowserWindow | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, "../../icon.png"),
    webPreferences: {
      nodeIntegration: false,
      webSecurity: false,
      contextIsolation: true,
      enableRemoteModule: true,
      preload: path.join(__dirname, "preload.js")
    },
    backgroundColor: "#fafafa",
    frame: false
  });
  mainWindow.maximize();
  BrowserWindowManager.setInstance(mainWindow);
  Menu.setApplicationMenu(null);
  if (app.isPackaged) {
    mainWindow.loadFile('./dist-app/index.html');
  } else {
    mainWindow.loadURL("http://localhost:8080");
    mainWindow.webContents.openDevTools();
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
