import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import { EngineScriptTemplate } from '@/models/engineScriptTemplate';
import { TemplateService } from '@/services/templateService';
import Vue from "vue";
import { BackstopConfiguration } from '@/models/backstopConfiguration';

@Module({
  namespaced: true
})
export default class TemplateStore extends VuexModule {
  private scripts: EngineScriptTemplate[] = [];
  private originalScriptNames: string[] = [];
  private scriptModified: boolean[] = [];
  private configurationTemplates: BackstopConfiguration[] = [];

  private get getScriptByName() {
    return (scriptName: string) => this.scripts.find((script) => script.name === scriptName);
  }

  public get hasScriptBeenModified() {
    return (idx: number) => !!this.scriptModified[idx];
  }

  @Action({rawError: true})
  public createEngineScriptTemplate({name, content}: EngineScriptTemplate) {
    const hasNameDuplicate = !!this.scripts.find((script) => script.name === name);
    if (hasNameDuplicate) {
      return Promise.reject("duplicateName");
    } else {
      return TemplateService.createScriptTemplate(name, content)
        .then(() => {
          this.context.commit("addEngineScriptTemplate", new EngineScriptTemplate(name, content));
        });
    }
  }

  @Action
  public retrieveEngineScriptTemplates() {
    return TemplateService.retrieveScriptTemplates()
      .then((scriptTemplates) => {
        this.context.commit("setEngineScriptTemplates", scriptTemplates);
      });
  }

  @Action({rawError: true})
  public saveTemplates() {
    const scriptNames = this.scripts.map((script) => script.name);
    const scriptNamesToDelete = this.originalScriptNames.filter((scriptName) => {
      return !scriptNames.includes(scriptName);
    });

    const savePromises = this.scripts.map((script) => TemplateService.createOrUpdateScriptTemplate(script));
    const deletionPromises = scriptNamesToDelete.map((name) => TemplateService.deleteScriptTemplate(name));

    const allPromises = [...savePromises, ...deletionPromises];
    return Promise.all(allPromises)
      .then(() => {
        this.context.commit("setOriginalScripts", this.scripts.map((script) => script.name));
      });
  }

  @Mutation
  private addEngineScriptTemplate(script: EngineScriptTemplate) {
    this.scripts.push(script);
    this.originalScriptNames.push(script.name);
  }

  @Mutation
  private addViewportInConfiguration(configurationIdx: number) {
    if (this.configurationTemplates[configurationIdx]) {
      if (!Array.isArray(this.configurationTemplates[configurationIdx].viewports)) {
        Vue.set(this.configurationTemplates[configurationIdx], "viewports", []);
      }
    }
    this.configurationTemplates[configurationIdx].viewports
      .push({label: "newViewport", height: 0, width: 0});
  }

  @Mutation
  private removeEngineScriptTemplate(script: EngineScriptTemplate) {
    const idx = this.scripts.indexOf(script);
    if (idx > -1) {
      this.scripts.splice(idx, 1);
    }
  }

  @Mutation
  private removeViewportInConfiguration(configurationIdx: number, viewportIdx: number) {
    if (this.configurationTemplates[configurationIdx]) {
      if (Array.isArray(this.configurationTemplates[configurationIdx].viewports)) {
        this.configurationTemplates[configurationIdx].viewports
          .splice(viewportIdx, 1);
      }
    }
  }

  @Mutation
  private setOriginalScripts(scriptsNames: string[]) {
    this.originalScriptNames = scriptsNames;
  }

  @Mutation
  private setEngineScriptTemplates(scripts: EngineScriptTemplate[]) {
    this.scripts = scripts;
    this.originalScriptNames = this.scripts.map((script) => script.name);
  }

  @Mutation
  private setEngineScriptTemplateContent({name, content}: {name: string, content: string}) {
    const script = this.scripts.find((scriptEntry) => scriptEntry.name === name);
    if (script) {
      script.content = content;
      const idx = this.scripts.indexOf(script);
      if (idx > -1) {
        Vue.set(this.scriptModified, idx, true);
      }
    }
  }

  @Mutation
  private setEngineScriptTemplateName({script, newName}: {script: EngineScriptTemplate, newName: string}) {
    const scriptIdx = this.scripts.indexOf(script);
    if (scriptIdx > -1) {
      this.scripts[scriptIdx].name = newName;
      Vue.set(this.scriptModified, scriptIdx, true);
    }
  }
}
