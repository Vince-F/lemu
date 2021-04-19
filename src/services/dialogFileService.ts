import { eventNames } from "../../shared/constants/eventNames";

export class DialogFileService {
  public static openFileDialog(): Promise<{path: string, content: unknown}> {
    return window.ipcHandler.invoke(eventNames.FILE_DIALOG);
  }

  public static selectDirectory(): Promise<string> {
    return window.ipcHandler.invoke(eventNames.DIRECTORY_DIALOG);
  }

  public static openAndParseFile(filePath: string): Promise<unknown> {
    return window.ipcHandler.invoke(eventNames.OPEN_FILE_AND_PARSE, filePath);
  }
}
