import fs = require("fs");
import vm = require("vm");
import path = require("path");

export class BackstopTestResultReader {
  public static retrieveReportResult(reportPath: string) {
    return this.openReportResult(reportPath)
      .then((content) => {
        return this.executeReportResult(content);
      });
  }

  private static openReportResult(reportPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      fs.readFile(path.join(reportPath, "config.js"), {encoding: "utf-8"}, (error, data) => {
        if (error) {
          console.error("Fail to open config file, path was", path.join(reportPath, "config.js"), " error is ", error);
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
