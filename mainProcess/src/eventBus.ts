import electron = require("electron");
import { BackstopTestRunner } from "./controllers/backstopTestRunner";
import { BackstopTestResultReader } from "./controllers/backstopTestResultReader";
import { AppInfoReader } from "./controllers/appInfoReader";

electron.ipcMain.on("setWorkingDir", (event, path) => {
  BackstopTestRunner.setWorkingDir(path);
});

electron.ipcMain.on("runTest", (event, config, scenarioLabel) => {
  BackstopTestRunner.runTest(config, scenarioLabel)
    .then((result) => {
      event.reply("testFinished", true, result);
    }).catch((error) => {
      event.reply("testFinished", false, error);
    });
});

electron.ipcMain.on("approveTest", (event, config, scenarioLabel, viewportLabel) => {
  BackstopTestRunner.approveTests(config, scenarioLabel, viewportLabel)
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

electron.ipcMain.on("retrieveTestsResult", (event, path) => {
  BackstopTestResultReader.retrieveReportResult(path)
    .then((result) => {
      event.reply("testsResult", true, result);
    }).catch((error) => {
      console.error("Result retrieval failed", error);
      event.reply("testsResult", false, error);
    });
});

electron.ipcMain.on("retrieveAppInfos", (event) => {
  Promise.all([AppInfoReader.getAppVersion(), AppInfoReader.getBackstopVersion()])
    .then((results) => {
      const data = {
        appVersion: results[0],
        backstopVersion: results[1]
      };
      event.reply("appInfos", data);
    });
});
