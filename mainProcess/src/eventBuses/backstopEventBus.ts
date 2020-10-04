import electron = require("electron");
import { BackstopTestRunner } from "../controllers/backstopTestRunner";
import { BackstopTestResultReader } from "../controllers/backstopTestResultReader";
import { eventNames } from "../shared/constants/eventNames";
import { BackstopFileService } from "../controllers/backstopFileService";

electron.ipcMain.on(eventNames.WORKING_DIR.REQUEST, (event, path) => {
  BackstopTestRunner.setWorkingDir(path);
});

electron.ipcMain.on(eventNames.RUN_TEST.REQUEST, (event, config, scenarioLabel) => {
  BackstopTestRunner.runTest(config, scenarioLabel)
    .then((result) => {
      event.reply(eventNames.RUN_TEST.REPLY, true, result);
    }).catch((error) => {
      event.reply(eventNames.RUN_TEST.REPLY, false, error.message);
    });
});

electron.ipcMain.on(eventNames.APPROVE_TEST.REQUEST, (event, config, scenarioLabel, viewportLabel) => {
  BackstopTestRunner.approveTests(config, scenarioLabel, viewportLabel)
    .then(() => {
      event.reply(eventNames.APPROVE_TEST.REPLY, true);
    }).catch((error) => {
      event.reply(eventNames.APPROVE_TEST.REPLY, false);
    });
});

electron.ipcMain.on(eventNames.INIT_TEST.REQUEST, (event, path) => {
  BackstopTestRunner.initTest(path)
    .then(() => {
      event.reply(eventNames.INIT_TEST.REPLY, true);
    }).catch((error) => {
      event.reply(eventNames.INIT_TEST.REPLY, false, error);
    });
});

electron.ipcMain.on(eventNames.RETRIEVE_TEST_RESULT.REQUEST, (event, path) => {
  BackstopTestResultReader.retrieveReportResult(path)
    .then((result) => {
      event.reply(eventNames.RETRIEVE_TEST_RESULT.REPLY, true, result);
    }).catch((error) => {
      event.reply(eventNames.RETRIEVE_TEST_RESULT.REPLY, false, error);
    });
});

electron.ipcMain.on(eventNames.RETRIEVE_CUSTOM_SCRIPTS.REQUEST, (event, path) => {
  BackstopFileService.retrieveEngineScripts(path)
    .then((files: string[]) => {
      event.reply(eventNames.RETRIEVE_CUSTOM_SCRIPTS.REPLY, true, files);
    }).catch((error) => {
      console.log(error);
      event.reply(eventNames.RETRIEVE_CUSTOM_SCRIPTS.REPLY, false, error);
    });
});

electron.ipcMain.on(eventNames.TEST_RESULT_CHANGED.REQUEST, (event, path) => {
  BackstopTestResultReader.watchResultChanges(path);
});

electron.ipcMain.on(eventNames.UNREGISTER_RESULT_WATCHER.REQUEST, (event, path) => {
  BackstopTestResultReader.unregisterResultWatcher();
});

electron.ipcMain.on(eventNames.CONFIG_CHANGED.REQUEST, (event, path) => {
  BackstopFileService.watchConfigurationFile(path);
});

electron.ipcMain.on(eventNames.UNREGISTER_CONFIG_WATCHER, (event) => {
  BackstopFileService.unregisterConfigurationWatcher();
})