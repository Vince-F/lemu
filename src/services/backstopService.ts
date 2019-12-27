// @ts-ignore
const electron = window.require("electron");

export class BackstopService {
  public static runTests(config: any) {
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
}
