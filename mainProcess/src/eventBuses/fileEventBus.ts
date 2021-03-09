import { ipcMain } from "electron";
import { eventNames } from "../../../shared/constants/eventNames";
import { FileService } from "../controllers/fileService";

ipcMain.handle(eventNames.OPEN_FILE_AND_PARSE, (event, path) => {
  return FileService.openAndParseFile(path);
});

ipcMain.handle(eventNames.COPY_FILE, (event, srcFile, destFile) => {
  return FileService.copyFile(srcFile, destFile);
});

ipcMain.handle(eventNames.DELETE_FILE, (event, path) => {
  return FileService.deleteFile(path);
});

ipcMain.handle(eventNames.READ_FILE, (event, path) => {
  return FileService.readFile(path);
});

ipcMain.on(eventNames.RESOLVE_PATH, (event, paths) => {
  event.returnValue = FileService.resolvePath(paths);
});

ipcMain.handle(eventNames.WRITE_FILE, (event, path, content) => {
  return FileService.writeFile(path, content);
});
