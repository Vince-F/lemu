import electron = require("electron");
import { AppInfoReader } from "../controllers/appInfoReader";
import { eventNames } from "../../../shared/constants/eventNames";
import { BrowserWindowManager } from "../controllers/browserWindowManager";

electron.ipcMain.handle(eventNames.APP_INFOS, (event) => {
  return Promise.all([AppInfoReader.getAppVersion(), AppInfoReader.getBackstopVersion()])
    .then((results) => {
      return {
        appVersion: results[0],
        backstopVersion: results[1]
      };
    });
});

electron.ipcMain.on(eventNames.HELP_WINDOW, () => {
  BrowserWindowManager.createHelpWindow();
});
