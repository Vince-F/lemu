import { app, BrowserWindow, Menu, protocol, ipcMain } from 'electron';
import { autoUpdater, AppUpdater } from "electron-updater";
import logger from "electron-log";

import path = require("path");
import "v8-compile-cache";

import "./eventBuses";
import { BrowserWindowManager } from './controllers/browserWindowManager';
import { eventNames } from '../../shared/constants/eventNames';

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
    callback({ path: path.normalize(`./dist-app/docs/${url}`) });
  });
  if (!successfull) {
    logger.error("Fail to register doc protocol");
  }
}

protocol.registerSchemesAsPrivileged([
  { scheme: 'doc', privileges: { secure: true, standard: true } }
]);

function manageUpdate(window: BrowserWindow) {
  window.webContents
    .executeJavaScript("localStorage.getItem(\"settings\");")
    .then((settings) => {
      autoUpdater.autoDownload = !!settings.autoUpdate;
      if (settings.autoUpdate) {
        try {
          autoUpdater.checkForUpdatesAndNotify();
        } catch (e) {
          logger.warn("Fail to check for updates");
        }
      } else {
        autoUpdater.on('update-available', () => {
          BrowserWindowManager.sendEvent(eventNames.UPDATE_AVAILABLE);
        });
        autoUpdater.checkForUpdates()
          .then((updateCheckResult) => {
            const updateVersion = updateCheckResult.updateInfo.version;
            console.log("update available for", updateVersion);
          }).catch((error) => {
            logger.warn("Fail to check for updates");
          });
      }
      autoUpdater.on('update-downloaded', () => {
        BrowserWindowManager.sendEvent(eventNames.UPDATE_DOWNLOADED);
      });

      ipcMain.on(eventNames.DOWNLOAD_UPDATE, () => {
        autoUpdater.downloadUpdate();
      });

      ipcMain.on(eventNames.INSTALL_AND_RESTART, () => {
        autoUpdater.quitAndInstall();
      });
    });
}

// for notification
app.setAppUserModelId(process.execPath);
app.commandLine.appendSwitch("disable-site-isolation-trials");

app.on('ready', () => {
  registerDocProtocol();
  createWindow();
  if (mainWindow) {
    manageUpdate(mainWindow);
  }
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
