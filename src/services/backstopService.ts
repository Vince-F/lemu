import { BackstopConfiguration } from '@/models/backstopConfiguration';

// @ts-ignore
const electron = window.require("electron");

export class BackstopService {
  public static runTests(config: BackstopConfiguration) {
    return new Promise((resolve, reject) => {
      electron.ipcRenderer.once("testFinished", (event: any, success: boolean, payload: any) => {
          if (success) {
            resolve(payload);
          } else {
            reject(payload);
          }
      });
      electron.ipcRenderer.send("runTest", config);
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
}
