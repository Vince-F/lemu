import Vue from "vue";
import { DialogFileService } from '@/services/dialogFileService';
import { FileService } from "../services/fileService";
import { BackstopConfiguration } from '@/models/backstopConfiguration';
import { BackstopTest } from '@/models/backstopTest';
import { BackstopService } from '@/services/backstopService';
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import { SearchService } from '@/services/searchService';

@Module({
  namespaced: true
})
export default class ConfigurationStore extends VuexModule {
  public currentConfiguration: BackstopConfiguration | null = null;
  public configurationPath: string = "";
  public testsModified: boolean[] = [];
  public configurationModified: boolean = false;
  public isSaving: boolean = false;

  public get configName() {
    return this.currentConfiguration?.id ?? "";
  }

  public get tests() {
    return this.currentConfiguration ? this.currentConfiguration.scenarios : [];
  }

  public get hasConfiguration() {
    return !!this.currentConfiguration;
  }

  public get hasTestBeenModified() {
    return (idx: number) => !!this.testsModified[idx];
  }

  public get hasConfigurationBeenModified() {
    return this.configurationModified;
  }

  public get backstopConfigurationDirectory() {
    return this.configurationPath.substr(0, this.configurationPath.length - "backstop.json".length);
  }

  public get htmlReportDirectory() {
    const reportPath = this.currentConfiguration?.paths?.html_report ?? "";
    const prefixPath = this.configurationPath.substr(0, this.configurationPath.length - "backstop.json".length);
    return reportPath &&
      FileService.resolvePath([prefixPath, reportPath]) || "";
  }

  public get engineScriptDirectory() {
    const engineScriptPath = this.currentConfiguration?.paths?.engine_scripts ?? "";
    const prefixPath = this.configurationPath.substr(0, this.configurationPath.length - "backstop.json".length);
    return engineScriptPath &&
      FileService.resolvePath([prefixPath, engineScriptPath]) || "";
  }

  @Mutation
  public addViewport() {
    if (this.currentConfiguration) {
      if (!Array.isArray(this.currentConfiguration.viewports)) {
        this.currentConfiguration.viewports = [];
      }
      this.currentConfiguration.viewports.push({ label: "", width: 0, height: 0 });
      this.configurationModified = true;
    }
  }

  @Mutation
  public addScenario() {
    if (this.currentConfiguration) {
      if (!Array.isArray(this.currentConfiguration.scenarios)) {
        this.currentConfiguration.scenarios = [];
      }
      const label = "New test " + (this.currentConfiguration.scenarios.length + 1);
      this.currentConfiguration.scenarios.push(new BackstopTest({ label }));
      this.configurationModified = true;
      SearchService.addDocumentsToIndex(this.currentConfiguration.scenarios);
    }
  }

  @Mutation
  public dismissCurrentConfiguration() {
    this.currentConfiguration = null;
    this.configurationPath = "";
    this.configurationModified = false;
    BackstopService.unregisterResultWatcher();
    BackstopService.unregisterConfigWatcher();
  }

  @Mutation
  public duplicateScenario(scenarioIndex: number) {
    if (this.currentConfiguration?.scenarios) {
      const currentTest = this.currentConfiguration.scenarios[scenarioIndex];
      const testLabelPrefix = currentTest.label + "Copy";
      const nbOfCopies = this.currentConfiguration.scenarios.filter((entry: BackstopTest) => {
        return entry.label.indexOf(testLabelPrefix) === 0;
      }).length;
      let testLabelName = currentTest.label + "Copy";
      if (nbOfCopies > 0) {
        testLabelName += nbOfCopies;
      }
      const newTest = new BackstopTest(currentTest);
      newTest.label = testLabelName;
      this.currentConfiguration.scenarios.push(newTest);
      this.configurationModified = true;
    }
  }

  @Mutation
  public setFullConfiguration(newConfiguration: BackstopConfiguration) {
    this.currentConfiguration = newConfiguration;
    this.testsModified = [];
    if (this.currentConfiguration && Array.isArray(this.currentConfiguration.scenarios)) {
      this.currentConfiguration.scenarios.forEach(() => {
        this.testsModified.push(false);
      });
    }
    this.configurationModified = false;
    SearchService.addDocumentsToIndex(this.currentConfiguration?.scenarios || []);
  }

  @Mutation
  public setPath(path: string) {
    this.configurationPath = path.replace(/\\/g, "/");
  }

  @Mutation
  public setConfigurationEngineOptionsField({ field, value }: { field: string, value: any }) {
    if (this.currentConfiguration?.paths) {
      Vue.set(this.currentConfiguration.engineOptions, field, value);
      this.configurationModified = true;
    }
  }

  @Mutation
  public setConfigurationField({ field, value }: { field: string, value: any }) {
    if (this.currentConfiguration) {
      Vue.set(this.currentConfiguration, field, value);
      this.configurationModified = true;
    }
  }

  @Mutation
  public setConfigurationPathField({ field, value }: { field: string, value: any }) {
    if (this.currentConfiguration?.paths) {
      Vue.set(this.currentConfiguration.paths, field, value);
      this.configurationModified = true;
    }
  }

  @Mutation
  public setConfigurationReport({ reportType, kept }: { reportType: "browser" | "CI" | "json", kept: boolean }) {
    if (this.currentConfiguration) {
      const idx = this.currentConfiguration.report.indexOf(reportType);
      if (kept && idx === -1) {
        this.currentConfiguration.report.push(reportType);
        this.configurationModified = true;
      } else if (!kept && idx !== -1) {
        this.currentConfiguration.report.splice(idx, 1);
        this.configurationModified = true;
      }
    }
  }

  @Mutation
  public setConfigurationViewportField(
    { viewportIndex, field, value }: { viewportIndex: number, field: string, value: any }
  ) {
    if (this.currentConfiguration?.viewports) {
      Vue.set(this.currentConfiguration.viewports[viewportIndex], field, value);
      this.configurationModified = true;
    }
  }

  @Mutation
  public setScenarioField(
    { scenarioIndex, field, value }: { scenarioIndex: number, field: string, value: any }
  ) {
    if (this.currentConfiguration?.scenarios) {
      Vue.set(this.currentConfiguration.scenarios[scenarioIndex], field, value);
      Vue.set(this.testsModified, scenarioIndex, true);
      this.configurationModified = true;
    }
  }

  @Mutation
  public removeEngineOption(fieldName: string) {
    if (this.currentConfiguration?.engineOptions) {
      Vue.delete(this.currentConfiguration.engineOptions, fieldName);
      this.configurationModified = true;
    }
  }

  @Mutation
  public removeScenario(index: number) {
    if (this.currentConfiguration?.scenarios) {
      this.currentConfiguration.scenarios.splice(index, 1);
      this.testsModified.splice(index, 1);
      this.configurationModified = true;
    }
  }

  @Mutation
  public removeScenarioField({ index, fieldName }: { index: number, fieldName: string }) {
    if (this.currentConfiguration?.scenarios) {
      Vue.delete(this.currentConfiguration.scenarios[index], fieldName);
      Vue.set(this.testsModified, index, true);
      this.configurationModified = true;
    }
  }

  @Mutation
  public removeViewport(index: number) {
    if (this.currentConfiguration) {
      this.currentConfiguration.viewports.splice(index, 1);
      this.configurationModified = true;
      SearchService.addDocumentsToIndex(this.currentConfiguration?.scenarios || []);
    }
  }

  @Mutation
  public resetModification() {
    for (let i = 0; i < this.testsModified.length; i++) {
      Vue.set(this.testsModified, i, false);
    }
  }

  @Mutation
  public setConfigurationModified() {
    this.configurationModified = false;
  }

  @Mutation
  public updateRecently(path: string) {
    let recentPaths: string[] = [];
    try {
      recentPaths = JSON.parse(localStorage.getItem("recentlyOpened") || "");
    } catch (e) {
      window.ipcHandler.logger.warn("fail to open recent path");
    }
    const idx = recentPaths.indexOf(path);
    if (idx > -1) {
      recentPaths.splice(idx, 1);
    }
    recentPaths.unshift(path);
    localStorage.setItem("recentlyOpened", JSON.stringify(recentPaths.slice(0, 5)));
  }

  @Mutation
  public setSavingState(savingState: boolean) {
    this.isSaving = savingState;
  }

  @Action({ rawError: true })
  public approveTests(): Promise<void> {
    if (this.context.rootState.testRunnerStore.testRunning) {
      return Promise.reject("Tests are running");
    }
    if (this.currentConfiguration) {
      return BackstopService.approveTests(this.currentConfiguration);
    } else {
      return Promise.reject("No configuration loaded");
    }
  }

  @Action({ rawError: true })
  public approveTest(testLabel: string): Promise<void> {
    if (this.context.rootState.testRunnerStore.testRunning) {
      return Promise.reject("Tests are running");
    }
    if (this.currentConfiguration) {
      return BackstopService.approveTest(this.currentConfiguration, testLabel);
    } else {
      return Promise.reject("No configuration loaded");
    }
  }

  @Action({ rawError: true })
  public approveTestViewport(payload: { testLabel: string, viewportLabel: string }): Promise<void> {
    if (this.context.rootState.testRunnerStore.testRunning) {
      return Promise.reject("Tests are running");
    }
    if (this.currentConfiguration) {
      return BackstopService.approveTest(this.currentConfiguration, payload.testLabel, payload.viewportLabel);
    } else {
      return Promise.reject("No configuration loaded");
    }
  }

  @Action({ rawError: true })
  public setContextAfterConfigLoaded(path: string): void {
    this.context.commit("setPath", path);
    this.context.commit("updateRecently", path);
    this.context.commit("testLogStore/resetLogs", null, { root: true });
    this.context.commit("testResultStore/expireTestsResult", undefined, { root: true });
    this.context.dispatch("testResultStore/watchResultChange", null, { root: true });
    this.context.dispatch("engineScriptStore/retrieveEngineScripts", null, { root: true });
    BackstopService.setWorkingDir(this.backstopConfigurationDirectory);
  }

  @Action({ rawError: true })
  public initConfig({ template, directory }: { template: BackstopConfiguration, directory: string }): Promise<void> {
    const path = FileService.resolvePath([directory, "backstop.json"]);
    return BackstopService.initTests(directory)
      .then(() => {
        if (template.id === "default") {
          return DialogFileService.openAndParseFile(path)
            .then((content) => {
              this.context.commit("setFullConfiguration", content);
            });
        } else {
          this.context.commit("setFullConfiguration", template);
          this.context.commit("setPath", path);
          return this.context.dispatch("saveConfiguration");
        }
      }).then(() => {
        return this.context.dispatch("setContextAfterConfigLoaded", path);
      });
  }

  @Action({ rawError: true })
  public openConfiguration(): Promise<void> {
    return DialogFileService.openFileDialog()
      .then(({ path, content }) => {
        if (typeof content.id !== "string" ||
          !Array.isArray(content.scenarios)) {
          return Promise.reject("File doesn't look like a BackstopJS configuration");
        }
        this.context.commit("setFullConfiguration", content);
        this.context.dispatch("setContextAfterConfigLoaded", path);
      });
  }

  @Action({ rawError: true })
  public openConfigurationFromPath(path: string): Promise<void> {
    return DialogFileService.openAndParseFile(path)
      .then((content) => {
        if (typeof content.id !== "string" ||
          !Array.isArray(content.viewports) ||
          !Array.isArray(content.scenarios)) {
          return Promise.reject("File doesn't look like a BackstopJS configuration");
        }
        this.context.commit("setFullConfiguration", content);
        this.context.dispatch("setContextAfterConfigLoaded", path);
      });
  }

  @Action({ rawError: true })
  public saveConfiguration(): Promise<void> {
    this.context.commit("setSavingState", true);
    const content = JSON.stringify(this.currentConfiguration, null, 4);

    return FileService.writeFile(this.configurationPath, content)
      .then(() => {
        this.context.commit("resetModification");
        this.context.commit("setConfigurationModified", false);
      }).finally(() => {
        this.context.commit("setSavingState", false);
      });
  }
}
