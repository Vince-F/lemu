import { EngineScriptTemplate } from '@/models/engineScriptTemplate';

export class TemplateService {
  public static createScriptTemplate(name: string, content: string) {
    return window.ipcHandler.sendSync("createScriptTemplate", name, content);
  }

  public static retrieveScriptTemplates(): Promise<EngineScriptTemplate[]> {
    return window.ipcHandler.invoke("retrieveScriptTemplates");
  }
}
