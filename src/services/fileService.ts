// @ts-ignore
const fs = window.require("fs");
// @ts-ignore
const path = window.require("path");

export class FileService {
  public static resolvePath(paths: string[]) {
    return path.resolve(...paths);
  }

  public static readFile(filePath: string) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, {encoding: "utf-8"}, (err:any, content: string) => {
        if (err) {
          reject(err);
        } else {
          resolve(content);
        }
      });
    });
  }
  
  public static writeFile(path: string, content: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.writeFile(path, content, {encoding: "utf-8"}, (err: any) => {
        if (err) {
          reject("There was en error while saving file: " + err.message);
        } else {
          resolve();
        }
      });
    });
  }
}
