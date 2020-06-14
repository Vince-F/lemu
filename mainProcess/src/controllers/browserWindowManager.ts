import { BrowserWindow } from "electron";


export class BrowserWindowManager {
  public static setInstance(inst: BrowserWindow) {
    this.winInstance = inst;
  }

  public static sendEvent(event: string, ...args: any[]) {
    if (!this.winInstance) {
      throw new Error("No Browser instance defined");
    } else {
      this.winInstance.webContents.send(event, ...args);
    }
  }

  private static winInstance: BrowserWindow;
}
