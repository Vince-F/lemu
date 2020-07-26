import { app, BrowserWindow, Menu } from 'electron';
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
      nodeIntegration: true,
      webSecurity: false,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js")
    },
    backgroundColor: "#fafafa"
  });
  mainWindow.maximize();
  BrowserWindowManager.setInstance(mainWindow);

  mainWindow.loadFile('./dist-app/index.html');
  // mainWindow.loadURL("http://localhost:8080");
  Menu.setApplicationMenu(null);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// for notification
app.setAppUserModelId(process.execPath);

app.on('ready', createWindow);

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
