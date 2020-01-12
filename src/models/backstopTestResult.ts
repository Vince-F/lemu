

export class BackstopTestResult {
  public pair: any; // TODO type it correctly
  public status: string; // TODO type with enum

  constructor(data: any) {
    this.pair = data && data.pair || null;
    this.status = data && data.status || "";
  }
}
