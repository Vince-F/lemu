import backstop = require("backstopjs");

export class BackstopTestRunner {
  public static initTest(path: string) {
    const oldPath = process.cwd();
    process.chdir(path);
    return backstop('init')
      .then(() => {
        process.chdir(oldPath);
      });
  }

  public static runTest(config: any, scenarioLabel?: string): Promise<any> {
    if (Array.isArray(config.report)) {
      const idx = config.report.indexOf("browser");
      if (idx > -1) {
        config.report.splice(idx, 1); // to prevent opening the browser
      }
    }
    let filterRegex;
    if (scenarioLabel && scenarioLabel.length) {
      filterRegex = "^" + scenarioLabel + "$";
    }
    console.log("Test filtered with ", filterRegex);
    return backstop('test', {
      filter: filterRegex,
      config
    });
  }

  public static approveTests(config: any, scenarioLabel?: string): Promise<any> {
    let filterRegex;
    if (scenarioLabel && scenarioLabel.length) {
      filterRegex = "^" + config.id + "_" + scenarioLabel.replace(/\s/g,"_")
                    .replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&') + 
                    "_\\d";
    }
    return backstop('approve', {
      config,
      filter: filterRegex
    });
  }
}
