import { app } from "electron";
import backstop = require("backstopjs");

export class AppInfoReader {
  public static getAppVersion() {
    return app.getVersion();
  }

  public static getBackstopVersion() {
    return backstop('version');
  }
}
