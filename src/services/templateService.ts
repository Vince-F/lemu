import { BackstopConfiguration } from '@/models/backstopConfiguration';
import { EngineScriptTemplate } from '@/models/engineScriptTemplate';

export class TemplateService {
  public static createScriptTemplate(name: string, content: string) {
    return window.ipcHandler.invoke("createScriptTemplate", name, content);
  }

  public static createOrUpdateScriptTemplate(scriptTemplate: EngineScriptTemplate) {
    return window.ipcHandler.invoke("createOrUpdateScriptTemplate", scriptTemplate.name, scriptTemplate.content);
  }

  public static retrieveScriptTemplates(): Promise<EngineScriptTemplate[]> {
    return window.ipcHandler.invoke("retrieveScriptTemplates");
  }

  public static deleteScriptTemplate(name: string) {
    return window.ipcHandler.invoke("deleteScriptTemplate", name);
  }

  public static createConfigurationTemplate(name: string, content: string) {
    return window.ipcHandler.invoke("createConfigurationTemplate", name, content);
  }

  public static createOrUpdateConfigurationTemplate(name: string, content: string) {
    return window.ipcHandler.invoke("createOrUpdateConfigurationTemplate", name, content);
  }

  public static retrieveConfigurationTemplates(): Promise<BackstopConfiguration[]> {
    return window.ipcHandler.invoke("retrieveConfigurationTemplates")
      .then((templates: Array<{name: string, content: string}>) => {
        return templates.map((entry) => new BackstopConfiguration(JSON.parse(entry.content)));
      });
  }

  public static deleteConfigurationTemplate(name: string) {
    return window.ipcHandler.invoke("deleteConfigurationTemplate", name);
  }
}
