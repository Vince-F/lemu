import {Worker} from "worker_threads";
import path = require("path");
import fs = require("fs");

export class BackstopWorkerManager {
  public static executeCommand(command: string, options?: any) {
    return new Promise((resolve, reject) => {
      fs.readFile(path.join(__dirname, "./backstopWorker.js"), {encoding: "utf-8"}, (err, fileContent) => {
        if (err) {
          reject("Failed to open test launcher.");
        } else {
          const worker = new Worker(fileContent, {
            eval: true
          });
          worker.once("message", (result) => {
            if (result.success) {
              resolve(...result.arguments);
            } else {
              reject(...result.arguments);
            }
            worker.terminate();
          });
          worker.postMessage({
            command,
            options
          });
        }
      });
    });
  }
}
