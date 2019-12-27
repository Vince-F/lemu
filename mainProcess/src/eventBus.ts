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

