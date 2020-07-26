import { dialog } from "electron";
import fs = require("fs");
import { FileService } from "./fileService";


export class DialogService {
  public static openFileDialog(): Promise<{path: string, content: any}> {
    return dialog.showOpenDialog({
      properties: ['openFile']
    }).then((file: any) => {
      if (!file.canceled) {
        const filePath = file.filePaths[0];
        return FileService.openAndParseFile(filePath)
          .then((fileContent) => {
            return {
              path: filePath,
              content: fileContent
            };
          });
      } else {
        return Promise.reject("dismiss");
      }
    });
  }

  public static selectDirectory(): Promise<string> {
    return dialog.showOpenDialog({
      properties: ['openDirectory']
    }).then((directorySelection: any) => {
      if (!directorySelection.canceled) {
        const filePath = directorySelection.filePaths[0];
        return filePath;
      } else {
        return Promise.reject("dismiss");
      }
    });
  }
}
