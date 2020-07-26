import { ipcMain } from "electron";
import { eventNames } from "../shared/constants/eventNames";
import { FileService } from "../controllers/fileService";

ipcMain.handle(eventNames.OPEN_FILE_AND_PARSE, async (event, path) => {
  return await FileService.openAndParseFile(path);
});
