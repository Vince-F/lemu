import fs = require("fs");

export class BackstopFileService {
  public static async retrieveCustomScripts(path: string) {
    const files = await this.retrieveCustomScriptsName(path);
    console.log("files found", files);
    return Promise.all(files.map((filePath) => this.createCustomScript(filePath)));
  }

  private static createCustomScript(path: string) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, {encoding: "utf-8"}, (err, content) => {
        if (err) {
          console.log(err);
          reject(err.message);
        } else {
          resolve({path, content});
        }
      });
    });
  }

  private static retrieveCustomScriptsName(path: string) {
    return this.getFilesInDirectories(path)
      .then((files: string[]) => {
        return files.filter((file) => {
          return file.endsWith(".js");
        });
      });
  }

  private static getFilesInDirectories(path: string) {
    return new Promise((resolve, reject) => {
      fs.readdir(path, { withFileTypes: true }, (err, files) => {
        if (err) {
          reject(err.message);
        } else {
          const allFiles = [];
          const directoryPromises = [];
          files.forEach((file) => {
            if (file.isDirectory()) {
              directoryPromises.push(this.getFilesInDirectories(path + "/" + file.name));
            } else {
              allFiles.push(path + "/" + file.name);
            }
          });
          Promise.all(directoryPromises)
            .then((filesFound) => {
              filesFound.forEach((filesInList) => {
                allFiles.push(...filesInList);
              });
              resolve(allFiles);
            }).catch((error) => {
              reject(error);
            });
        }
      });
    });
  }
}
