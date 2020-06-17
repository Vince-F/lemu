export class TreeEntry {
  public id: string;
  public name: string;
  public children: TreeEntry[];
  public isScript: boolean;

  constructor() {
    this.id = "";
    this.name = "";
    this.children = [];
    this.isScript = false;
  }
}
