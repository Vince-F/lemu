import { BackstopConfiguration } from '@/models/backstopConfiguration';
import { BackstopReport } from '@/models/backstopReport';
import { EngineScript } from '@/models/engineScript';
import { eventNames } from "../../shared/constants/eventNames";

export class BackstopService {
  public static setWorkingDir(path: string) {
    window.ipcHandler.send(eventNames.WORKING_DIR, path);
  }

  public static runTests(config: BackstopConfiguration) {
    return window.ipcHandler.invoke(eventNames.RUN_TEST, config)
      .then((result: {success: boolean, content: any}) => {
        return this.handleTestFinished(result);
      });
  }

  public static runTest(config: BackstopConfiguration, testLabel: string) {
    return window.ipcHandler.invoke(eventNames.RUN_TEST, config, testLabel)
      .then((result: {success: boolean, content: any}) => {
        return this.handleTestFinished(result);
      });
  }

  public static approveTests(config: BackstopConfiguration) {
    return window.ipcHandler.invoke(eventNames.APPROVE_TEST, config)
      .then((result: {success: boolean}) => {
        if (!result.success) {
          return Promise.reject();
        }
      });
  }

  public static approveTest(config: BackstopConfiguration, testLabel: string, viewportLabel?: string) {
    return window.ipcHandler.invoke(eventNames.APPROVE_TEST, config, testLabel, viewportLabel)
      .then((result: {success: boolean}) => {
        if (!result.success) {
          return Promise.reject();
        }
      });
  }

  public static initTests(path: string) {
    return window.ipcHandler.invoke("initTest", path);
  }

  public static retrieveEngineScripts(path: string): Promise<EngineScript[]> {
    return window.ipcHandler.invoke(eventNames.RETRIEVE_ENGINE_SCRIPTS, path)
      .then((result: {success: boolean, content: any}) => {
        if (result.success) {
          if (Array.isArray(result.content)) {
            return result.content.map((entry) => {
              return new EngineScript(entry.dirPath, entry.content);
            });
          } else {
            return [];
          }
        } else {
          return Promise.reject(result.content);
        }
      });
  }

  public static retrieveTestsResult(path: string): Promise<BackstopReport> {
    return window.ipcHandler.invoke(eventNames.RETRIEVE_TEST_RESULT, path)
      .then((result: {success: boolean, content: any}) => {
        if (result.success) {
          return new BackstopReport(result.content);
        } else {
          return Promise.reject(result.content);
        }
      });
  }

  public static registerResultWatcher(path: string, cb: () => void) {
    window.ipcHandler.receive(eventNames.TEST_RESULT_CHANGED.REPLY, () => {
      cb();
    });
    window.ipcHandler.receiveOnce(eventNames.TEST_RESULT_CHANGED.NOT_EXIST, () => {
      this.registerAgainTestWatcher = true;
      this.resultPath = path;
    });
    window.ipcHandler.send(eventNames.TEST_RESULT_CHANGED.REQUEST, path);
  }

  public static unregisterResultWatcher() {
    window.ipcHandler.send(eventNames.UNREGISTER_RESULT_WATCHER.REQUEST);
  }

  public static registerConfigWatcher(path: string, cb: () => void) {
    window.ipcHandler.receive(eventNames.CONFIG_CHANGED.REPLY, () => {
      cb();
    });
    window.ipcHandler.send(eventNames.CONFIG_CHANGED.REQUEST, path);
  }

  public static unregisterConfigWatcher() {
    window.ipcHandler.send(eventNames.UNREGISTER_CONFIG_WATCHER.REQUEST);
  }

  public static renameReferenceWithNewConfigName(refDirectory: string, oldRefName: string, newRefName: string) {
    window.ipcHandler.invoke(eventNames.RENAME_REFERENCES, refDirectory, oldRefName, newRefName);
  }

  private static registerAgainTestWatcher: boolean = false;
  private static resultPath: string = "";

  private static handleTestFinished(result: {success: boolean, content: any}) {
    if (this.registerAgainTestWatcher) {
      window.ipcHandler.send(eventNames.TEST_RESULT_CHANGED.REQUEST, this.resultPath);
      this.resultPath = "";
      this.registerAgainTestWatcher = false;
    }

    if (result.success) {
      const notif = new Notification('LEMU', {
        body: 'Tests finished running with success'
      });
      return result.content;
    } else {
      const notif = new Notification('LEMU', {
        body: 'Tests finished running with error(s)'
      });
      return Promise.reject(result.content);
    }
  }
}
