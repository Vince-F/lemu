import { BackstopTestResult } from "./backstopTestResult";

export class BackstopReport {
  public id: string;
  public testSuite: string;
  public testsResult: BackstopTestResult[];

  constructor(data: any) { // eslint-disable-line
    this.id = data?.id ?? "";
    this.testSuite = data?.testSuite ?? "";
    this.testsResult = [];
    if (data && Array.isArray(data.tests)) {
      this.testsResult = data.tests.map((entry: unknown) => {
        return new BackstopTestResult(entry);
      });
    }
  }
}
