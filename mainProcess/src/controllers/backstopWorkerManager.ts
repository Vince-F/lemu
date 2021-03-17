import { Worker } from "worker_threads";
import path = require("path");
import fs = require("fs");
import { eventNames } from "../../../shared/constants/eventNames";
import { BrowserWindowManager } from "./browserWindowManager";

export class BackstopWorkerManager {
  public static executeCommand(workingPath: string, command: string, options?: any) {
    return new Promise((resolve, reject) => {
      fs.readFile(path.join(__dirname, "./backstopWorker.js"), {encoding: "utf-8"}, (err, fileContent) => {
        if (err) {
          reject("Failed to open test launcher.");
        } else {
          const worker = new Worker(fileContent, {
            eval: true,
            stderr: true,
            stdout: true
          });
          worker.on("message", (result) => {
            if (result.success) {
              resolve(result.arguments[0]);
            } else {
              reject(result.arguments[0]);
            }
            worker.terminate();
          });
          BrowserWindowManager.sendEvent(eventNames.TEST_LOG.REPLY, {
            level: "divider",
            message: ""
          });

          worker.postMessage({
            command,
            options,
            workingPath
          });

          worker.stdout.on("data", (data: Buffer) => {
            console.log(data.toString());
            BrowserWindowManager.sendEvent(eventNames.TEST_LOG.REPLY, {
              level: "info",
              message: data.toString()
            });
          });

          worker.stderr.on("data", (data: Buffer) => {
            console.error(data.toString());
            BrowserWindowManager.sendEvent(eventNames.TEST_LOG.REPLY, {
              level: "error",
              message: data.toString()
            });
          });
        }
      });
    });
  }
}
