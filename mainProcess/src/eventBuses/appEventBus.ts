import electron = require("electron");
import { AppInfoReader } from "../controllers/appInfoReader";
import { eventNames } from "../shared/constants/eventNames";
import { BrowserWindowManager } from "../controllers/browserWindowManager";

electron.ipcMain.on(eventNames.APP_INFOS.REQUEST, (event) => {
  Promise.all([AppInfoReader.getAppVersion(), AppInfoReader.getBackstopVersion()])
    .then((results) => {
      const data = {
        appVersion: results[0],
        backstopVersion: results[1]
      };
      event.reply(eventNames.APP_INFOS.REPLY, data);
    });
});

electron.ipcMain.on(eventNames.HELP_WINDOW, () => {
  BrowserWindowManager.createHelpWindow();
});
