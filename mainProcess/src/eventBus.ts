import electron = require("electron");
import { BackstopTestRunner } from "./controllers/backstopTestRunner";

electron.ipcMain.on("runTest", (event, config) => {
  config.report = ["CI", "html"]; // to prevent opening the browser
  BackstopTestRunner.runTest(config)
    .then((result) => {
      event.reply("testFinished", true, result);
    }).catch((error) => {
      event.reply("testFinished", false, error);
    });
});

electron.ipcMain.on("approveTest", (event, config) => {
  BackstopTestRunner.approveTests(config)
    .then(() => {
      event.reply("approvalFinished", true);
    }).catch((error) => {
      event.reply("approvalFinished", false);
    });
});

electron.ipcMain.on("initTest", (event, path) => {
  BackstopTestRunner.initTest(path)
    .then(() => {
      event.reply("initFinished", true);
    }).catch((error) => {
      event.reply("initFinished", false, error);
    });
});
