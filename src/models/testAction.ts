export class TestAction {
  public type: string;
  public selector?: string;
  public delay?: number;
  public key?: string;
  public text?: string;
  public coordinate?: {
    x: number;
    y: number;
  };

  constructor(data?:any) { // eslint-disable-line
    this.type = data?.type ?? "";
    this.selector = data?.selector;
    this.coordinate = data?.coordinate;
    this.delay = data?.delay;
    this.key = data?.key;
    this.text = data?.text;
  }
}
