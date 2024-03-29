import { Worker } from "worker_threads";
import path = require("path");
import fs = require("fs");
import { eventNames } from "../../../shared/constants/eventNames";
import { BrowserWindowManager } from "./browserWindowManager";
import { BackstopTestResultReader } from "./backstopTestResultReader";
import logger from "electron-log";

export class BackstopWorkerManager {
  public static executeCommand(workingPath: string, command: string, options?: unknown) {
    return new Promise((resolve, reject) => {
      const worker = new Worker(path.join(__dirname, "./backstopWorker.js"), {
        stderr: true,
        stdout: true
      });
      this.lastWorker = worker;
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
        const message = data.toString();
        if (message.includes(this.approveEndSentence)) {
          this.recordApprovalEnabled = false;
          this.updateApprovalResult(workingPath);
        } else if (message.includes(this.approveStartSentence)) {
          this.recordApprovalEnabled = true;
          this.fileToUpdateInReport = [];
        } else if (this.recordApprovalEnabled) {
          this.addApprovalResultToUpdate(message);
        }

        logger.log(message);
        BrowserWindowManager.sendEvent(eventNames.TEST_LOG.REPLY, {
          level: "info",
          message
        });
      });

      worker.stderr.on("data", (data: Buffer) => {
        logger.warn(data.toString());
        BrowserWindowManager.sendEvent(eventNames.TEST_LOG.REPLY, {
          level: "error",
          message: data.toString()
        });
      });
    });
  }

  public static stopCommand() {
    if (this.lastWorker) {
      // this will leave open processes because backstop won't clean chromium processes. Maybe this drawback is acceptable.
      return this.lastWorker.terminate();
    } else {
      return Promise.resolve();
    }
  }

  private static lastWorker?: Worker;
  private static readonly approveStartSentence: string = "The following files will be promoted to reference...";
  private static readonly approveEndSentence: string = "COMMAND | Command \"approve\" successfully executed";
  private static recordApprovalEnabled: boolean = false;
  private static fileToUpdateInReport: string[] = [];

  private static addApprovalResultToUpdate(message: string) {
    const filename = message.replace(">  ", "").replace("\n", "");
    this.fileToUpdateInReport.push(filename);
  }

  private static updateApprovalResult(workingPath: string) {
    // TODO: this is false if the config is custom
    const reportPath = path.join(workingPath, "backstop_data/html_report/");
    BackstopTestResultReader.retrieveReportResult(reportPath)
      .then((reportContent: any) => {
        if (Array.isArray(reportContent?.tests)) {
          reportContent?.tests.forEach((entry: any) => {
            if (this.fileToUpdateInReport.includes(entry?.pair?.fileName)) {
              entry.status = "pass";
            }
          });
        }
        const content = "report(" + JSON.stringify(reportContent) + ");";
        fs.writeFile(path.join(reportPath, "config.js"), content, { encoding: "utf-8" }, (err) => {
          if (err) {
            logger.error("Failed to update report:", err.message);
          } else {
            logger.log("Report successfully updated");
          }
        });
      });
  }
}
