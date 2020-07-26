import fs = require("fs");

export class FileService {
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
