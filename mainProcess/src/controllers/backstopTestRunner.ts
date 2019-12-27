import backstop = require("backstopjs");

export class BackstopTestRunner {
  public static runTest(config: any) {
    return backstop('test', {
      config
    });
  }
}
