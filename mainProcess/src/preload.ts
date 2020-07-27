import { contextBridge, ipcRenderer } from "electron";


declare global {
  interface Window {
    ipcHandler: {
      send: (channel: string, ...args: any[]) => void;
      sendSync: (channel: string, ...args: any[]) => any;
      receive: (channel: string, callback: (...args: any[]) => void) => void;
      receiveOnce: (channel: string, callback: (...args: any[]) => void) => void;
      invoke: (channel: string, ...args: any[]) => Promise<any>;
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
  }
};

contextBridge.exposeInMainWorld(
  "ipcHandler", ipcHandler
);
