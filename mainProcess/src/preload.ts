import { contextBridge, ipcRenderer } from "electron";
import { Titlebar, Color } from "custom-electron-titlebar";
import logger from "electron-log";

let titleBar: any /* Titlebar | null typing seem borken in CET */ = null;

declare global {
  interface Window {
    ipcHandler: {
      send: (channel: string, ...args: any[]) => void;
      sendSync: (channel: string, ...args: any[]) => any;
      receive: (channel: string, callback: (...args: any[]) => void) => void;
      receiveOnce: (channel: string, callback: (...args: any[]) => void) => void;
      invoke: (channel: string, ...args: any[]) => Promise<any>;
      createTitleBar: () => void;
      updateTitleBarTitle: (newTitle: string) => void;
      logger: {
        silly(...args: string[]): void;
        info(...args: string[]): void;
        warn(...args: string[]): void;
        error(...args: string[]): void;
      };
    };
  }
}

const ipcHandler = {
  send: (channel: string, ...args: any[]) => {
    ipcRenderer.send(channel, ...args);
  },

  sendSync: (channel: string, ...args: any[]) => {
    return ipcRenderer.sendSync(channel, ...args);
  },

  receive: (channel: string, callback: (...args: any[]) => void) => {
    ipcRenderer.on(channel, (event, ...args) => callback(event, ...args));
  },

  receiveOnce: (channel: string, callback: (...args: any[]) => void) => {
    ipcRenderer.once(channel, (event, ...args) => callback(event, ...args));
  },

  invoke: (channel: string, ...args: any[]) => {
    return ipcRenderer.invoke(channel, ...args);
  },

  createTitleBar: () => {
    titleBar = new Titlebar({
      backgroundColor: Color.fromHex('#02468a'),
      icon: "../../assets/icon.png",
    });
    titleBar.updateTitle("Lemu");
  },

  updateTitleBarTitle: (newTitle: string) => {
    if (titleBar) {
      if (newTitle) {
        newTitle = `Lemu - ${newTitle}`;
      } else {
        newTitle = "Lemu";
      }
      titleBar.updateTitle(newTitle);
    }
  },

  logger: {
    silly(...args: string[]): void {
      logger.silly(...args);
    },
    info(...args: string[]): void {
      logger.info(...args);
    },
    warn(...args: string[]): void {
      logger.warn(...args);
    },
    error(...args: string[]): void {
      logger.error(...args);
    }
  }
};

contextBridge.exposeInMainWorld(
  "ipcHandler", ipcHandler
);
