import {Worker} from "worker_threads";
import path = require("path");

export class BackstopWorkerManager {
  public static executeCommand(command: string, options?: any) {
    const worker = new Worker(path.join(__dirname, "./backstopWorker.js"));
    return new Promise((resolve, reject) => {
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
    });
  }
}
