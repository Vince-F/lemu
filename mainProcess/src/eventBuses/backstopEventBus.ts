import electron = require("electron");
import { BackstopTestRunner } from "../controllers/backstopTestRunner";
import { BackstopTestResultReader } from "../controllers/backstopTestResultReader";
import { eventNames } from "../../../shared/constants/eventNames";
import { BackstopFileService } from "../controllers/backstopFileService";

electron.ipcMain.on(eventNames.WORKING_DIR, (event, path) => {
  BackstopTestRunner.setWorkingDir(path);
});

electron.ipcMain.handle(eventNames.RUN_TEST, (event, config, scenarioLabel) => {
  return BackstopTestRunner.runTest(config, scenarioLabel)
    .then((result) => {
      return {
        success: true,
        content: result
      };
    }).catch((error) => {
      return {
        success: false,
        content: error.message
      };
    });
});

electron.ipcMain.handle(eventNames.APPROVE_TEST, (event, config, scenarioLabel, viewportLabel) => {
  return BackstopTestRunner.approveTests(config, scenarioLabel, viewportLabel)
    .then(() => {
      return {
        success: true
      };
    }).catch((error) => {
      return {
        success: false,
        content: error.message
      };
    });
});

electron.ipcMain.handle(eventNames.INIT_TEST, (event, path) => {
  return BackstopTestRunner.initTest(path);
});

electron.ipcMain.handle(eventNames.RETRIEVE_ENGINE_SCRIPTS, (event, path) => {
  return BackstopFileService.retrieveEngineScripts(path)
    .then((files: Array<{dirPath: string, content: string}>) => {
      return {
        success: true,
        content: files
      };
    }).catch((error) => {
      return {
        success: false,
        content: error
      };
    });
});

electron.ipcMain.handle(eventNames.RETRIEVE_TEST_RESULT, (event, path) => {
  return BackstopTestResultReader.retrieveReportResult(path)
    .then((result) => {
      return {
        success: true,
        content: result
      };
    }).catch((error) => {
      return {
        success: false,
        content: error
      };
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

electron.ipcMain.on(eventNames.UNREGISTER_CONFIG_WATCHER.REQUEST, () => {
  BackstopFileService.unregisterConfigurationWatcher();
});
