import fs = require("fs");
import path = require("path");
import { eventNames } from "../shared/constants/eventNames";
import { BrowserWindowManager } from "./browserWindowManager";

export class BackstopFileService {
  public static async retrieveEngineScripts(path: string) {
    const files = await this.retrieveEngineScriptsName(path);
    return Promise.all(files.map((filePath) => this.createEngineScript(filePath)));
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

  private static configFileWatcher: fs.FSWatcher;

  private static createEngineScript(path: string) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, {encoding: "utf-8"}, (err, content) => {
        if (err) {
          reject(err.message);
        } else {
          resolve({path, content});
        }
      });
    });
  }

  private static retrieveEngineScriptsName(path: string) {
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
