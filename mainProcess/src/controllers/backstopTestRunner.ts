import backstop = require("backstopjs");
import puppeteer = require("puppeteer");

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
    config = this.setPuppeteerExecutablePath(config);
    return backstop('test', {
      filter: filterRegex,
      config
    });
  }

  public static approveTests(config: any, scenarioLabel?: string): Promise<any> {
    let filterRegex;
    if (scenarioLabel && scenarioLabel.length) {
      filterRegex = "^" + config.id + "_" + this.cleanFilename(scenarioLabel) +
                    "_\\d";
    }
    return backstop('approve', {
      config,
      filter: filterRegex
    });
  }

  private static setPuppeteerExecutablePath(config: any) {
    if (!config.engineOptions) {
      config.engineOptions = {};
    }
    if (!config.engineOptions.executablePath) {
      config.engineOptions.executablePath = puppeteer.executablePath().replace('app.asar', 'app.asar.unpacked');
      console.log("changed puppeteer path to ", config.engineOptions.executablePath);
    }
    return config;
  }

  private static cleanFilename(filename: string) {
    // imitate backstop behavior to have a filename that looks alike
    return filename.replace(/[ /]/g, '_')
      .replace(/[^a-z0-9_-]/gi, ''); // remove anything that's not a letter or a number or dash or underscore.
  }
}
