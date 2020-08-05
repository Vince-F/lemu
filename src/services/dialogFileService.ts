export class DialogFileService {
  public static openFileDialog(): Promise<{path: string, content: any}> {
    return window.ipcHandler.invoke("openFileDialog");
  }

  public static selectDirectory(): Promise<string> {
    return window.ipcHandler.invoke("openDirectoryDialog");
  }

  public static openAndParseFile(filePath: string): Promise<any> {
    return window.ipcHandler.invoke("openFileAndParse", filePath);
  }
}
