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

  public static runTest(config: any): Promise<any> {
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
