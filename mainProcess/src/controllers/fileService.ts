import fs = require("fs");
import path = require("path");

export class FileService {
  public static copyFile(originPath: string, destinationPath: string) {
    return new Promise((resolve, reject) => {
      fs.copyFile(originPath, destinationPath, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  public static deleteFile(filePath: string) {
    return new Promise((resolve, reject) => {
      fs.unlink(filePath, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
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

  public static readFile(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, {encoding: "utf-8"}, (err: any, content: string) => {
        if (err) {
          reject(err);
        } else {
          resolve(content);
        }
      });
    });
  }

  public static resolvePath(paths: string[]) {
    return path.resolve(...paths);
  }

  public static writeFile(filePath: string, content: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.writeFile(filePath, content, {encoding: "utf-8"}, (err: any) => {
        if (err) {
          reject("There was en error while saving file: " + err.message);
        } else {
          resolve();
        }
      });
    });
  }
}
