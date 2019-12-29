import backstop = require("backstopjs");

export class BackstopTestRunner {
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
