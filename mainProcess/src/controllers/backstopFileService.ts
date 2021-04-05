import fs = require("fs");
import path = require("path");
import { eventNames } from "../../../shared/constants/eventNames";
import { BrowserWindowManager } from "./browserWindowManager";

export class BackstopFileService {
  public static async retrieveEngineScripts(dirPath: string): Promise<Array<{ dirPath: string, content: string }>> {
    const files = await this.retrieveEngineScriptsName(dirPath);
    return Promise.all(files.map((filePath) => this.readEngineScript(filePath)));
  }

  public static watchConfigurationFile(configPath: string) {
    this.configFileWatcher = fs.watch(configPath);

    let eventReceived = false;
    this.configFileWatcher.on("change", (eventType) => {
      if (!eventReceived) {
        eventReceived = true;
        BrowserWindowManager.sendEvent(eventNames.CONFIG_CHANGED.REPLY);
        // mitigate watch being called twice on change
        setTimeout(() => {
          eventReceived = false;
        }, 300);
      }
    });
  }

  public static unregisterConfigurationWatcher() {
    if (this.configFileWatcher) {
      this.configFileWatcher.close();
    }
  }

  public static renameReferenceWithNewConfigName(refDirectory: string, oldRefName: string,
                                                 newRefName: string): Promise<void> {
    return new Promise((resolve, reject) => {
      fs.readdir(refDirectory, (err, files) => {
        if (err) {
          reject(err);
        } else {
          const renamePromises = files.map((filename) => {
            return new Promise((resolve2, reject2) => {
              fs.rename(path.join(refDirectory, filename),
                path.join(refDirectory, filename.replace(oldRefName, newRefName)), (err) => {
                  if (err) {
                    reject2(err);
                  } else {
                    resolve2(null);
                  }
                });
            });
          });
          Promise.all(renamePromises)
            .then(() => {
              resolve();
            }).catch((e) => {
              reject(new Error(e));
            })
        }
      });
    });
  }

  private static configFileWatcher: fs.FSWatcher;

  private static readEngineScript(dirPath: string): Promise<{ dirPath: string, content: string }> {
    return new Promise((resolve, reject) => {
      fs.readFile(dirPath, { encoding: "utf-8" }, (err, content) => {
        if (err) {
          reject(err.message);
        } else {
          resolve({ dirPath, content });
        }
      });
    });
  }

  private static retrieveEngineScriptsName(dirPath: string): Promise<string[]> {
    return this.getFilesInDirectories(dirPath)
      .then((files: string[]) => {
        return files.filter((file) => {
          return file.endsWith(".js");
        });
      });
  }

  private static getFilesInDirectories(dirPath: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
      fs.readdir(dirPath, { withFileTypes: true }, (err, files) => {
        if (err) {
          reject(err.message);
        } else {
          const allFiles: string[] = [];
          const directoryPromises: Array<Promise<string[]>> = [];
          files.forEach((file) => {
            if (file.isDirectory()) {
              directoryPromises.push(this.getFilesInDirectories(dirPath + "/" + file.name));
            } else {
              allFiles.push(dirPath + "/" + file.name);
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
