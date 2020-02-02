const {app, BrowserWindow, Menu} = require('electron');
import path = require("path");
import "v8-compile-cache";

import "./eventBus";


let mainWindow: Electron.BrowserWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 0,
    height: 0,
    icon: path.join(__dirname, "../../icon.png"),
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false
    },
    backgroundColor: "#fafafa"
  });
  mainWindow.maximize();

  mainWindow.loadFile('./dist-app/index.html');
  // mainWindow.loadURL("http://localhost:8080");
  Menu.setApplicationMenu(null);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

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

