import { BrowserWindow } from "electron";
import path = require("path");

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

  public static createHelpWindow() {
    let helpWindow = new BrowserWindow({
      width: 0,
      height: 0,
      icon: path.join(__dirname, "../../../icon.png"),
      backgroundColor: "#fafafa"
    });
    helpWindow.maximize();

    //helpWindow.loadFile('./dist-app/docs/index.html');
    helpWindow.loadURL("doc://-");

    helpWindow.on('closed', () => {
      helpWindow = null;
    });
  }

  private static winInstance: BrowserWindow;
}
