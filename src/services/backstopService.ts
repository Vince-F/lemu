import { BackstopConfiguration } from '@/models/backstopConfiguration';
import { BackstopReport } from '@/models/backstopReport';

export class BackstopService {
  public static setWorkingDir(path: string) {
    window.ipcHandler.send("setWorkingDir", path);
  }

  public static runTests(config: BackstopConfiguration) {
    return new Promise((resolve, reject) => {
      window.ipcHandler.receiveOnce("testFinished", (event: any, success: boolean, payload: any) => {
          if (success) {
            resolve(payload);
            new Notification('LEMU', {
              body: 'Tests finished running with success'
            });
          } else {
            reject(payload);
            new Notification('LEMU', {
              body: 'Tests finished running with error(s)'
            });
          }
          if (this.registerAgainTestWatcher) {
            window.ipcHandler.send("watchTestResultsChange", this.resultPath);
            this.resultPath = "";
            this.registerAgainTestWatcher = false;
          }
      });
      window.ipcHandler.send("runTest", config);
    });
  }

  public static runTest(config: BackstopConfiguration, testLabel: string) {
    return new Promise((resolve, reject) => {
      window.ipcHandler.receiveOnce("testFinished", (event: any, success: boolean, payload: any) => {
          if (success) {
            resolve(payload);
            new Notification('LEMU', {
              body: 'Tests finished running with success'
            });
          } else {
            reject(payload);
            new Notification('LEMU', {
              body: 'Tests finished running with error(s)'
            });
          }
      });
      window.ipcHandler.send("runTest", config, testLabel);
    });
  }

  public static approveTests(config: BackstopConfiguration) {
    return new Promise((resolve, reject) => {
      window.ipcHandler.receiveOnce("approvalFinished", (event: any, success: boolean, payload: any) => {
        if (success) {
          resolve();
        } else {
          reject(payload);
        }
      });
      window.ipcHandler.send("approveTest", config);
    });
  }

  public static approveTest(config: BackstopConfiguration, testLabel: string, viewportLabel?: string) {
    return new Promise((resolve, reject) => {
      window.ipcHandler.receiveOnce("approvalFinished", (event: any, success: boolean, payload: any) => {
        if (success) {
          resolve();
        } else {
          reject(payload);
        }
      });
      window.ipcHandler.send("approveTest", config, testLabel, viewportLabel);
    });
  }

  public static initTests(path: string) {
    return new Promise((resolve, reject) => {
      window.ipcHandler.receiveOnce("initFinished", (event: any, success: boolean, payload: any) => {
        if (success) {
          resolve();
        } else {
          reject();
        }
      });
      window.ipcHandler.send("initTest", path);
    });
  }

  public static retrieveEngineScripts(path: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      window.ipcHandler.receiveOnce("engineScripts",
        (event: any, success: boolean, payload: any) => {
        if (success) {
          resolve(payload);
        } else {
          reject(payload);
        }
      });
      window.ipcHandler.send("retrieveEngineScripts", path);
    });
  }

  public static retrieveTestsResult(path: string): Promise<BackstopReport> {
    return new Promise((resolve, reject) => {
      window.ipcHandler.receiveOnce("testsResult", (event: any, success: boolean, payload: any) => {
        if (success) {
          resolve(new BackstopReport(payload));
        } else {
          reject(payload);
        }
      });
      window.ipcHandler.send("retrieveTestsResult", path);
    });
  }

  public static registerResultWatcher(path: string, cb: () => void) {
    window.ipcHandler.receive("testResultsChanged", () => {
      cb();
    });
    window.ipcHandler.receiveOnce("testResultNonExistent", () => {
      this.registerAgainTestWatcher = true;
      this.resultPath = path;
    });
    window.ipcHandler.send("watchTestResultsChange", path);
  }

  public static unregisterResultWatcher() {
    window.ipcHandler.send("unregisterResultWatcher");
  }

  public static registerConfigWatcher(path: string, cb: () => void) {
    window.ipcHandler.receive("configChanged", () => {
      cb();
    });
    window.ipcHandler.send("watchConfigChange", path);
  }

  public static unregisterConfigWatcher() {
    window.ipcHandler.send("unregisterConfigWatcher");
  }

  private static registerAgainTestWatcher: boolean = false;
  private static resultPath: string = "";
}
