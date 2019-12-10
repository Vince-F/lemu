// @ts-ignore
const fs = window.require("fs");

export class FileService {
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
