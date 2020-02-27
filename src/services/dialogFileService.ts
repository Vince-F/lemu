// @ts-ignore
const electron = window.require("electron");
// @ts-ignore
const fs = window.require("fs");

export class DialogFileService {
  public static openFileDialog(): Promise<{path: string, content: any}> {
    return electron.remote.dialog.showOpenDialog({
      properties: ['openFile']
    }).then((file: any) => {
      if (!file.canceled) {
        const filePath = file.filePaths[0];
        return this.openAndParseFile(filePath)
          .then((fileContent) => {
            return {
              path: filePath,
              content: fileContent
            };
          });
      } else {
        return Promise.reject("dismiss");
      }
    });
  }

  public static selectDirectory(): Promise<string> {
    return electron.remote.dialog.showOpenDialog({
      properties: ['openDirectory']
    }).then((directorySelection: any) => {
      if (!directorySelection.canceled) {
        const filePath = directorySelection.filePaths[0];
        return filePath;
      } else {
        return Promise.reject("dismiss");
      }
    });
  }

  public static openAndParseFile(filePath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, {encoding: "utf-8"}, (err: any, content: string) => {
        if (err) {
          reject(err);
        } else {
          try {
            resolve(JSON.parse(content));
          } catch (e) {
            reject("Fail to parse file as JSON");
          }
        }
      });
    });
  }
}
