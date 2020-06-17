import { BackstopConfiguration } from '@/models/backstopConfiguration';
import { BackstopReport } from '@/models/backstopReport';

// @ts-ignore
const electron = window.require("electron");

export class BackstopService {
  public static setWorkingDir(path: string) {
    electron.ipcRenderer.send("setWorkingDir", path);
  }

  public static runTests(config: BackstopConfiguration) {
    return new Promise((resolve, reject) => {
      electron.ipcRenderer.once("testFinished", (event: any, success: boolean, payload: any) => {
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
      electron.ipcRenderer.send("runTest", config);
    });
  }

  public static runTest(config: BackstopConfiguration, testLabel: string) {
    return new Promise((resolve, reject) => {
      electron.ipcRenderer.once("testFinished", (event: any, success: boolean, payload: any) => {
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
      electron.ipcRenderer.send("runTest", config, testLabel);
    });
  }

  public static approveTests(config: BackstopConfiguration) {
    return new Promise((resolve, reject) => {
      electron.ipcRenderer.once("approvalFinished", (event: any, success: boolean, payload: any) => {
        if (success) {
          resolve();
        } else {
          reject(payload);
        }
      });
      electron.ipcRenderer.send("approveTest", config);
    });
  }

  public static approveTest(config: BackstopConfiguration, testLabel: string, viewportLabel?: string) {
    return new Promise((resolve, reject) => {
      electron.ipcRenderer.once("approvalFinished", (event: any, success: boolean, payload: any) => {
        if (success) {
          resolve();
        } else {
          reject(payload);
        }
      });
      electron.ipcRenderer.send("approveTest", config, testLabel, viewportLabel);
    });
  }

  public static initTests(path: string) {
    return new Promise((resolve, reject) => {
      electron.ipcRenderer.once("initFinished", (event: any, success: boolean, payload: any) => {
        if (success) {
          resolve();
        } else {
          reject();
        }
      });
      electron.ipcRenderer.send("initTest", path);
    });
  }

  public static retrieveEngineScripts(path: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      electron.ipcRenderer.once("engineScripts",
        (event: any, success: boolean, payload: any) => {
        if (success) {
          resolve(payload);
        } else {
          reject(payload);
        }
      });
      electron.ipcRenderer.send("retrieveEngineScripts", path);
    });
  }

  public static retrieveTestsResult(path: string): Promise<BackstopReport> {
    return new Promise((resolve, reject) => {
      electron.ipcRenderer.once("testsResult", (event: any, success: boolean, payload: any) => {
        if (success) {
          resolve(new BackstopReport(payload));
        } else {
          reject(payload);
        }
      });
      electron.ipcRenderer.send("retrieveTestsResult", path);
    });
  }
}
