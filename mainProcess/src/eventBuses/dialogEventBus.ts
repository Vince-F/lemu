import { ipcMain } from "electron";
import { eventNames } from "../../../shared/constants/eventNames";
import { DialogService } from "../controllers/dialogService";

ipcMain.handle(eventNames.FILE_DIALOG, () => {
  return DialogService.openFileDialog();
});

ipcMain.handle(eventNames.DIRECTORY_DIALOG, () => {
  return DialogService.selectDirectory();
});
