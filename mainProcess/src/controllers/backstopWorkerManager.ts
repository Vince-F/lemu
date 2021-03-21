import { Worker } from "worker_threads";
import path = require("path");
import fs = require("fs");
import { eventNames } from "../../../shared/constants/eventNames";
import { BrowserWindowManager } from "./browserWindowManager";
import { BackstopTestResultReader } from "./backstopTestResultReader";

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
            console.log(message);
            BrowserWindowManager.sendEvent(eventNames.TEST_LOG.REPLY, {
              level: "info",
              message
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

  private static readonly approveStartSentence: string = "The following files will be promoted to reference...";
  private static readonly approveEndSentence: string = "COMMAND | Command \"approve\" successfully executed";
  private static recordApprovalEnabled: boolean = false;
  private static fileToUpdateInReport: string[] = [];

  private static addApprovalResultToUpdate(message: string) {
    const filename = message.replace(">  ", "").replace("\n", "");
    this.fileToUpdateInReport.push(filename);
  }

  private static updateApprovalResult(workingPath: string) {
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
            console.error("Failed to update report:", err.message);
          } else {
            console.log("Report successfully updated");
          }
        });
      });
  }
}
