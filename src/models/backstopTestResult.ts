
export class BackstopTestResult {
  // TODO type it correctly
  public pair: any; // eslint-disable-line
  public status: string; // TODO type with enum

  constructor(data: any) {  // eslint-disable-line
    this.pair = data?.pair ?? null;
    this.status = data?.status ?? "";
  }
}
