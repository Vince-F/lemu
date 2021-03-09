import { ipcMain } from "electron";
import { eventNames } from "../../../shared/constants/eventNames";
import { DialogService } from "../controllers/dialogService";

ipcMain.handle(eventNames.FILE_DIALOG, (event, args) => {
  return DialogService.openFileDialog();
});

ipcMain.handle(eventNames.DIRECTORY_DIALOG, (events, args) => {
  return DialogService.selectDirectory();
});
