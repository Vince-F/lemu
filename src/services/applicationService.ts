// @ts-ignore
const electron = window.require("electron");

export class ApplicationService {
  public static getVersionsInfo() {
    return new Promise((resolve, reject) => {
      electron.ipcRenderer.once("appInfos", (event: any, appInfos: any) => {
        resolve(appInfos);
      });
      electron.ipcRenderer.send("retrieveAppInfos");
    });
  }
}
