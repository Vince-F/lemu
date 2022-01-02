

export class ApplicationInfo {
  public appVersion: string;
  public backstopVersion: string;

  constructor(data: any) {
    this.appVersion = data?.appVersion ?? "";
    this.backstopVersion = data?.backstopVersion ?? "";
  }
}
