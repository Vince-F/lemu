export class TreeEntry {
  public id: string;
  public name: string;
  public children: TreeEntry[];

  constructor() {
    this.id = "";
    this.name = "";
    this.children = [];
  }
}
