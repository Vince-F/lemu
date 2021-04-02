import { app } from "electron";

export class AppInfoReader {
  private static get backstop() {
    const backstop = require("backstopjs");
    return backstop;
  }

  public static getAppVersion() {
    return app.getVersion();
  }

  public static getBackstopVersion() {
    return this.backstop('version');
  }
}
