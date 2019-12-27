import electron = require("electron");
import { BackstopTestRunner } from "./controllers/backstopTestRunner";

console.log("put listener in place");
electron.ipcMain.on("runTest", (event, config) => {
  console.log("Begin to run tests");
  config.report = ["CI", "html"]; // to prevent opening the browser
  BackstopTestRunner.runTest(config)
    .then((result) => {
      console.log("Test run ok");
      event.reply("testFinished", true, result);
    }).catch((error) => {
      console.log("Test run failed");
      event.reply("testFinished", false, error);
    });
});

