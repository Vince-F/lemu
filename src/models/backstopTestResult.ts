
export class BackstopTestResult {
  public pair: unknown; // TODO type it correctly
  public status: string; // TODO type with enum

  constructor(data: any) {  // eslint-disable-line
    this.pair = data?.pair ?? null;
    this.status = data?.status ?? "";
  }
}
