import { BackstopWorkerManager } from "./backstopWorkerManager";
import logger from "electron-log";

export class BackstopTestRunner {
  /* set import in getter to avoid loading them at launch time */
  private static get puppeteer() {
    const puppeteer = require("puppeteer");
    return puppeteer;
  }

  public static setWorkingDir(workingPath: string) {
    this.workingPath = workingPath;
  }

  public static initTest(workingPath: string) {
    return BackstopWorkerManager.executeCommand(workingPath, "init");
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
    logger.silly("Test filtered with ", filterRegex);
    config = this.setPuppeteerExecutablePath(config);
    return BackstopWorkerManager.executeCommand(this.workingPath, "test", {
      filter: filterRegex,
      config
    });
  }

  public static stopTest() {
    return BackstopWorkerManager.stopCommand();
  }

  public static approveTests(config: any, scenarioLabel?: string, viewportLabel?: string): Promise<any> {
    let filterRegex;
    if (scenarioLabel && scenarioLabel.length) {
      filterRegex = "^" + config.id + "_" + this.cleanFilename(scenarioLabel) +
                    "_\\d+";
      if (viewportLabel && viewportLabel.length) {
        filterRegex += "_.+_" + this.cleanFilename(viewportLabel);
      }
    }
    return BackstopWorkerManager.executeCommand(this.workingPath, 'approve', {
      config,
      filter: filterRegex
    });
  }

  private static workingPath: string = "";

  private static setPuppeteerExecutablePath(config: any) {
    if (!config.engineOptions) {
      config.engineOptions = {};
    }
    if (!config.engineOptions.executablePath) {
      config.engineOptions.executablePath = this.puppeteer.executablePath().replace('app.asar', 'app.asar.unpacked');
    }
    return config;
  }

  private static cleanFilename(filename: string) {
    // imitate backstop behavior to have a filename that looks alike
    return filename.replace(/[ /]/g, '_')
      .replace(/[^a-z0-9_-]/gi, ''); // remove anything that's not a letter or a number or dash or underscore.
  }
}
