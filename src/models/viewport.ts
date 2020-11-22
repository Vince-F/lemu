export class Viewport {
  public label: string;
  public width: number;
  public height: number;

  constructor(data?: any) {
    this.label = data?.label ?? "";
    this.height = data?.height ?? 0;
    this.width = data?.width ?? 0;
  }
}
