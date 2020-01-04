import backstop = require("backstopjs");

export class BackstopTestRunner {
  public static runTest(config: any): Promise<any> {
    if (Array.isArray(config.report)) {
      const idx = config.report.indexOf("browser");
      if (idx > -1) {
        config.report.splice(idx, 1); // to prevent opening the browser
      }
    }
    return backstop('test', {
      config
    });
  }

  public static approveTests(config: any): Promise<any> {
    return backstop('approve', {
      config
    });
  }
}
