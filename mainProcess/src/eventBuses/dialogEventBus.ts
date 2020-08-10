import { ipcMain } from "electron";
import { eventNames } from "../shared/constants/eventNames";
import { DialogService } from "../controllers/dialogService";

ipcMain.handle(eventNames.FILE_DIALOG, async (event, args) => {
  return await DialogService.openFileDialog();
});

ipcMain.handle(eventNames.DIRECTORY_DIALOG, async (events, args) => {
  return await DialogService.selectDirectory();
});
