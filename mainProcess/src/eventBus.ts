import electron = require("electron");
import { BackstopTestRunner } from "./controllers/backstopTestRunner";
import { BackstopTestResultReader } from "./controllers/backstopTestResultReader";

electron.ipcMain.on("runTest", (event, config, scenarioLabel) => {
  BackstopTestRunner.runTest(config, scenarioLabel)
    .then((result) => {
      event.reply("testFinished", true, result);
    }).catch((error) => {
      event.reply("testFinished", false, error);
    });
});

electron.ipcMain.on("approveTest", (event, config, scenarioLabel) => {
  BackstopTestRunner.approveTests(config, scenarioLabel)
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
