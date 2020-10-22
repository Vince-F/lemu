import { ipcMain } from "electron";
import { eventNames } from "../shared/constants/eventNames";
import { TemplateManager } from "../controllers/templateManager";

ipcMain.handle(eventNames.CREATE_SCRIPT_TEMPLATE, (event, name: string, content: string) => {
  return TemplateManager.getInstance().createScriptTemplate(name, content);
});

ipcMain.handle(eventNames.RETRIEVE_SCRIPT_TEMPLATES, (event) => {
  return TemplateManager.getInstance().retrieveEngineScriptTemplates();
});

