export class FileService {
  public static resolvePath(paths: string[]): string {
    return window.ipcHandler.sendSync("resolvePath", paths);
  }

  public static readFile(filePath: string): Promise<string> {
    return window.ipcHandler.invoke("readFile", filePath);
  }

  public static writeFile(filePath: string, content: string): Promise<void> {
    return window.ipcHandler.invoke("writeFile", filePath, content);
  }

  public static copyFile(originPath: string, destinationPath: string): Promise<void> {
    return window.ipcHandler.invoke("copyFile", originPath, destinationPath);
  }

  public static deleteFile(filePath: string): Promise<void> {
    return window.ipcHandler.invoke("deleteFile", filePath);
  }
}
