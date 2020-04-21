import { BackstopTestResult } from './backstopTestResult';

export class BackstopReport {
  public id: string;
  public testSuite: string;
  public testsResult: BackstopTestResult[];

  constructor(data: any) {
    this.id = data && data.id || "";
    this.testSuite = data && data.testSuite || "";
    this.testsResult = [];
    if (data && Array.isArray(data.tests)) {
      this.testsResult = data.tests.map((entry: any) => {
        return new BackstopTestResult(entry);
      });
    }
  }
}
