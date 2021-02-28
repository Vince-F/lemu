import { ipcMain } from "electron";
import { eventNames } from "../shared/constants/eventNames";
import { TemplateManager } from "../controllers/templateManager";

ipcMain.handle(eventNames.CREATE_SCRIPT_TEMPLATE, (event, name: string, content: string) => {
  return TemplateManager.getInstance().createScriptTemplate(name, content);
});

ipcMain.handle(eventNames.CREATE_OR_UPDATE_SCRIPT_TEMPLATE, (event, name: string, content: string) => {
  return TemplateManager.getInstance().createOrUpdateScriptTemplate(name, content);
});

ipcMain.handle(eventNames.RETRIEVE_SCRIPT_TEMPLATES, (event) => {
  return TemplateManager.getInstance().retrieveEngineScriptTemplates();
});

ipcMain.handle(eventNames.DELETE_SCRIPT_TEMPLATE, (event, name: string) => {
  return TemplateManager.getInstance().deleteScriptTemplate(name);
});

ipcMain.handle(eventNames.CREATE_CONFIGURATION_TEMPLATE, (event, name: string, content: string) => {
  return TemplateManager.getInstance().createConfigurationTemplate(name, content);
});

ipcMain.handle(eventNames.CREATE_OR_UPDATE_CONFIGURATION_TEMPLATE, (event, name: string, content: string) => {
  return TemplateManager.getInstance().createOrUpdateConfigurationTemplate(name, content);
});

ipcMain.handle(eventNames.RETRIEVE_CONFIGURATION_TEMPLATES, (event) => {
  return TemplateManager.getInstance().retrieveConfigurationTemplates();
});

ipcMain.handle(eventNames.DELETE_CONFIGURATION_TEMPLATE, (event, name: string) => {
  return TemplateManager.getInstance().deleteConfigurationTemplate(name);
});
