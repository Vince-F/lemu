import fs = require("fs");
import vm = require("vm");
import path = require("path");
import { BrowserWindowManager } from "./browserWindowManager";
import { eventNames } from "../../../shared/constants/eventNames";
import logger = require("electron-log");

export class BackstopTestResultReader {
  public static retrieveReportResult(reportPath: string) {
    return this.openReportResult(reportPath)
      .then((content) => {
        return this.executeReportResult(content);
      });
  }

  public static watchResultChanges(reportPath: string) {
    if (fs.existsSync(path.join(reportPath, "config.js"))) {
      this.resultFileWatcher = fs.watch(path.join(reportPath, "config.js"));

      this.resultFileWatcher.on("change", () => {
        BrowserWindowManager.sendEvent(eventNames.TEST_RESULT_CHANGED.REPLY);
      });
    } else {
      BrowserWindowManager.sendEvent(eventNames.TEST_RESULT_CHANGED.NOT_EXIST);
    }
  }

  public static unregisterResultWatcher() {
    if (this.resultFileWatcher) {
      this.resultFileWatcher.close();
    }
  }

  private static resultFileWatcher: fs.FSWatcher;

  private static openReportResult(reportPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const configPath = path.join(reportPath, "config.js");
      fs.readFile(configPath, {encoding: "utf-8"}, (error, data) => {
        if (error) {
          logger.error("Fail to open config file, path was", configPath, " error is ", error);
          reject(error);
        } else {
          resolve(data);
        }
      });
    });
  }

  private static executeReportResult(content: string) {
    const code = "function report(content) { reportContent = content }" + content;
    const context = {reportContent: ""};
    vm.runInNewContext(code, context);

    return context.reportContent;
  }
}
