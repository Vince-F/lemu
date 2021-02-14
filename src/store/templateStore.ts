import { VuexModule, Module, Mutation, Action, config } from 'vuex-module-decorators';
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
  private scriptLoaded: boolean = false;
  private configurationTemplates: BackstopConfiguration[] = [];
  private originalConfigurationNames: string[] = [];
  private configurationsModified: boolean[] = [];
  private configurationLoaded: boolean = false;

  private get getScriptByName() {
    return (scriptName: string) => this.scripts.find((script) => script.name === scriptName);
  }

  public get hasScriptBeenModified() {
    return (idx: number) => !!this.scriptModified[idx];
  }

  public get hasConfigurationBeenModified() {
    return (idx: number) => !!this.configurationsModified[idx];
  }

  @Action({rawError: true})
  public createConfigurationTemplate(configuration: BackstopConfiguration) {
    const hasNameDuplicate = !!this.configurationTemplates.find(
      (existingConfig) => configuration.id === existingConfig.id);
    if (hasNameDuplicate) {
      return Promise.reject("duplicateName");
    } else {
      return TemplateService.createConfigurationTemplate(configuration.id, JSON.stringify(configuration))
        .then(() => {
          this.context.commit("addConfigurationTemplate", configuration);
        });
    }
  }

  @Action
  public retrieveConfigurationTemplates() {
    if (this.configurationLoaded) {
      return Promise.resolve();
    } else {
      return TemplateService.retrieveConfigurationTemplates()
        .then((configurationTemplates) => {
          this.context.commit("setConfigurationTemplates", configurationTemplates);
          this.context.commit("setConfigurationLoaded");
        });
    }
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
    if (this.scriptLoaded) {
      return Promise.resolve();
    } else {
      return TemplateService.retrieveScriptTemplates()
        .then((scriptTemplates) => {
          this.context.commit("setEngineScriptTemplates", scriptTemplates);
          this.context.commit("setScriptLoaded");
        });
    }
  }

  @Action({rawError: true})
  public saveTemplates() {
    const scriptNames = this.scripts.map((script) => script.name);
    const scriptNamesToDelete = this.originalScriptNames.filter((scriptName) => {
      return !scriptNames.includes(scriptName);
    });
    const configNames = this.configurationTemplates.map((configuration) => configuration.id);
    const configNamesToDelete = this.originalConfigurationNames.filter((configName) => {
      return !configNames.includes(configName);
    });

    const saveScriptPromises = this.scripts.map((script) => TemplateService.createOrUpdateScriptTemplate(script));
    const deletionScriptPromises = scriptNamesToDelete.map((name) => TemplateService.deleteScriptTemplate(name));

    const saveConfigPromises = this.configurationTemplates
      .map((configuration) => TemplateService.
        createOrUpdateConfigurationTemplate(configuration.id, JSON.stringify(configuration)));
    const deletionConfigPromises = configNamesToDelete.map((name) => TemplateService.deleteConfigurationTemplate(name));

    const allPromises = [...saveScriptPromises, ...deletionScriptPromises,
      ...saveConfigPromises, ...deletionConfigPromises];
    return Promise.all(allPromises)
      .then(() => {
        this.context.commit("setOriginalScripts", this.scripts.map((script) => script.name));
      });
  }

  @Mutation
  private addConfigurationTemplate(configuration: BackstopConfiguration) {
    this.configurationTemplates.push(configuration);
    this.originalConfigurationNames.push(configuration.id);
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
      this.configurationTemplates[configurationIdx].viewports
        .push({label: "newViewport", height: 0, width: 0});
      Vue.set(this.configurationsModified, configurationIdx, true);
    }
  }

  @Mutation
  private setFieldInConfiguration({configIdx, field, value}: {configIdx: number, field: string, value: any}) {
    if (this.configurationTemplates[configIdx]) {
      Vue.set(this.configurationTemplates[configIdx], field, value);
      Vue.set(this.configurationsModified, configIdx, true);
    }
  }

  @Mutation
  private setPathFieldInConfiguration({configIdx, field, value}: {configIdx: number, field: string, value: any}) {
    if (this.configurationTemplates[configIdx]) {
      Vue.set(this.configurationTemplates[configIdx].paths, field, value);
      Vue.set(this.configurationsModified, configIdx, true);
    }
  }

  @Mutation
  private setReportInConfiguration({configIdx, reportType, kept}:
      {configIdx: number, reportType: string, kept: boolean}) {
    if (this.configurationTemplates[configIdx]) {
      Vue.set(this.configurationTemplates[configIdx].paths, reportType, kept);
      Vue.set(this.configurationsModified, configIdx, true);
    }
  }

  @Mutation
  private setViewportFieldInConfiguration({configIdx, viewportIndex, field, value}:
      {configIdx: number, viewportIndex: number, field: string, value: any}) {
    if (this.configurationTemplates[configIdx]) {
      if (!Array.isArray(this.configurationTemplates[configIdx].viewports)) {
        this.configurationTemplates[configIdx].viewports = [];
      }
      Vue.set(this.configurationTemplates[configIdx].viewports[viewportIndex],
        field, value);
      Vue.set(this.configurationsModified, configIdx, true);
    }
  }

  @Mutation
  private setEngineOptionInConfiguration({configIdx, field, value}:
      {configIdx: number, viewportIndex: number, field: string, value: any}) {
    if (this.configurationTemplates[configIdx]) {
      Vue.set(this.configurationTemplates[configIdx].engineOptions,
        field, value);
      Vue.set(this.configurationsModified, configIdx, true);
    }
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
        Vue.set(this.configurationsModified, configurationIdx, true);
      }
    }
  }

  @Mutation
  private removeEngineOptionInConfiguration({configIdx, fieldName}: {configIdx: number, fieldName: string}) {
    if (this.configurationTemplates[configIdx]) {
      Vue.delete(this.configurationTemplates[configIdx].engineOptions, fieldName);
      Vue.set(this.configurationsModified, configIdx, true);
    }
  }

  @Mutation
  private setConfigurationTemplates(configurations: BackstopConfiguration[]) {
    this.configurationTemplates = configurations;
    this.originalConfigurationNames = this.configurationTemplates.map((configuration) => configuration.id);
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

  @Mutation
  private setConfigurationLoaded() {
    this.configurationLoaded = true;
  }

  @Mutation
  private setScriptLoaded() {
    this.scriptLoaded = true;
  }
}
