export class ApplicationService {
  public static getVersionsInfo() {
    return new Promise((resolve, reject) => {
      window.ipcHandler.receiveOnce("appInfos", (event: any, appInfos: any) => {
        resolve(appInfos);
      });
      window.ipcHandler.send("retrieveAppInfos");
    });
  }
}
