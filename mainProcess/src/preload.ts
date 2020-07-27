import { contextBridge, ipcRenderer } from "electron";

class IpcHandler {
  public send(channel: string, ...args: any[]) {
    ipcRenderer.send(channel, ...args);
  }

  public sendSync(channel: string, ...args: any[]) {
    return ipcRenderer.sendSync(channel, ...args);
  }

  public receive(channel: string, callback: (...args: any[]) => void) {
    ipcRenderer.on(channel, (event, ...args) => callback(event, ...args));
  }

  public receiveOnce(channel: string, callback: (...args: any[]) => void) {
    ipcRenderer.once(channel, (event, ...args) => callback(event, ...args));
  }

  public invoke(channel: string, ...args: any[]) {
    return ipcRenderer.invoke(channel, ...args);
  }
}

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

window.ipcHandler = new IpcHandler();

/*contextBridge.exposeInMainWorld(
  "ipcHandler", new IpcHandler()
);*/
