import Vue from "vue";
import { DialogFileService } from '@/services/dialogFileService';
import { FileService } from "../services/fileService";
import { BackstopConfiguration } from '@/models/backstopConfiguration';
import { BackstopTest } from '@/models/backstopTest';
import { BackstopService } from '@/services/backstopService';

export default {
  namespaced: true,
  state: {
    currentConfiguration: null as BackstopConfiguration | null,
    configurationPath: "",
    testsModified: [] as boolean[],
    configurationModified: false,
    testRunning: false
  },
  mutations: {
    addViewport(state: any) {
      if (state.currentConfiguration) {
        state.currentConfiguration.viewports.push({label: "", width: 0, height: 0});
        state.configurationModified = true;
      }
    },

    addScenario(state: any) {
      if (state.currentConfiguration.scenarios) {
        const label = "New test " + (state.currentConfiguration.scenarios.length + 1);
        state.currentConfiguration.scenarios.push(new BackstopTest({ label }));
        state.configurationModified = true;
      }
    },

    dismissCurrentConfiguration(state: any) {
      state.currentConfiguration = null;
      state.configurationPath = "";
      state.configurationModified = false;
    },

    duplicateScenario(state: any, scenarioIndex: number) {
      if (state.currentConfiguration.scenarios) {
        const currentTest = state.currentConfiguration.scenarios[scenarioIndex];
        const testLabelPrefix = currentTest.label + "Copy";
        const nbOfCopies = state.currentConfiguration.scenarios.filter((entry: BackstopTest) => {
          return entry.label.indexOf(testLabelPrefix) === 0;
        }).length;
        let testLabelName = currentTest.label + "Copy";
        if (nbOfCopies > 0) {
          testLabelName += nbOfCopies;
        }
        const newTest = new BackstopTest(currentTest);
        newTest.label = testLabelName;
        state.currentConfiguration.scenarios.push(newTest);
        state.configurationModified = true;
      }
    },

    setFullConfiguration(state: any, { newConfiguration }: any) {
      state.currentConfiguration = newConfiguration;
      state.testsModified = [];
      for (const scenario of state.currentConfiguration.scenarios) {
        state.testsModified.push(false);
      }
      state.configurationModified = false;
    },

    setPath(state: any, path: string) {
      state.configurationPath = path;
    },

    setConfigurationField(state: any, { field, value }: { field: string, value: any }) {
      if (state.currentConfiguration) {
        const obj = {} as any;
        obj[field] = value;
        Object.assign(state.currentConfiguration, obj);
        state.configurationModified = true;
      }
    },

    setConfigurationPathField(state: any, { field, value }: { field: string, value: any }) {
      if (state.currentConfiguration.paths) {
        const obj = {} as any;
        obj[field] = value;
        Object.assign(state.currentConfiguration.paths, obj);
        state.configurationModified = true;
      }
    },

    setConfigurationReport(state: any, {reportType, kept}: {reportType: string, kept: boolean}) {
      const idx = state.currentConfiguration.report.indexOf(reportType);
      if (kept && idx === -1) {
        state.currentConfiguration.report.push(reportType);
      } else if (!kept && idx !== -1) {
        state.currentConfiguration.report.splice(idx, 1);
      }
      state.configurationModified = true;
    },

    setConfigurationViewportField(
      state: any,
      { viewportIndex, field, value }: { viewportIndex: number, field: string, value: any }
    ) {
      if (state.currentConfiguration.viewports) {
        Vue.set(state.currentConfiguration.viewports[viewportIndex], field, value);
        state.configurationModified = true;
      }
    },

    setScenarioField(
      state: any,
      {scenarioIndex, field, value}: {scenarioIndex: number, field: string, value: any}
    ) {
      if (state.currentConfiguration.scenarios) {
        Vue.set(state.currentConfiguration.scenarios[scenarioIndex], field, value);
        Vue.set(state.testsModified, scenarioIndex, true);
        state.configurationModified = true;
      }
    },

    removeScenario(state: any, index: number) {
      if (state.currentConfiguration.scenarios) {
        state.currentConfiguration.scenarios.splice(index, 1);
        state.testsModified.splice(index, 1);
        state.configurationModified = true;
      }
    },

    removeScenarioField(state: any, {index, fieldName}: { index: number, fieldName: string}) {
      if (state.currentConfiguration.scenarios) {
        Vue.delete(state.currentConfiguration.scenarios[index], fieldName);
        Vue.set(state.testsModified, index, true);
        state.configurationModified = true;
      }
    },

    removeViewport(state: any, index: number) {
      if (state.currentConfiguration) {
        state.currentConfiguration.viewports.splice(index, 1);
        state.configurationModified = true;
      }
    },

    resetModification(state: any) {
      for (let i = 0; i < state.testsModified.length; i++) {
        Vue.set(state.testsModified, i, false);
      }
    },

    runTest(state: any) {
      state.testRunning = true;
    },

    stopTest(state: any) {
      state.testRunning = false;
    },

    setConfigurationModified(state: any, modified: boolean) {
      state.configurationModified = false;
    }
  },
  actions: {
    approveTests({state}: any) {
      if (state.testRunning) {
        return Promise.reject("Tests are running");
      }
      return BackstopService.approveTests(state.currentConfiguration);
    },

    approveTest({state}: any, testLabel: string) {
      if (state.testRunning) {
        return Promise.reject("Tests are running");
      }
      return BackstopService.approveTest(state.currentConfiguration, testLabel);
    },

    initConfig({state, commit}: any) {
      return DialogFileService.selectDirectory()
        .then((path) => {
          return BackstopService.initTests(path)
            .then(() => {
              return DialogFileService.openAndParseFile(path + "/backstop.json")
                .then((content) => {
                  commit("setFullConfiguration", {
                    newConfiguration: content
                  });
                  commit("setPath", path + "/backstop.json");
                });
            });
        });
    },

    openConfiguration(store: any) {
      return DialogFileService.openFileDialog()
        .then(({ path, content }) => {
          if (typeof content.id !== "string" ||
              !Array.isArray(content.viewports) ||
              !Array.isArray(content.scenarios)) {
            return Promise.reject("File doesn't look like a BackstopJS configuration");
          }
          store.commit("setFullConfiguration", {
            newConfiguration: content
          });
          store.commit("setPath", path);
          return Promise.resolve();
        });
    },

    runTests({commit, state}: any) {
      commit("runTest");
      return BackstopService.runTests(state.currentConfiguration)
        .then((result) => {
          return result;
        }).catch((error) => {
          return Promise.reject(error);
        }).finally(() => {
          commit("stopTest");
          commit("testResultStore/expireTestsResult", undefined, {root: true});
        });
    },

    runTest({commit, state}: any, testLabel: string) {
      commit("runTest");
      return BackstopService.runTest(state.currentConfiguration, testLabel)
        .then((result) => {
          return result;
        }).catch((error) => {
          return Promise.reject(error);
        }).finally(() => {
          commit("stopTest");
          commit("testResultStore/expireTestsResult", undefined, {root: true});
        });
    },

    saveConfiguration(store: any) {
      const content = JSON.stringify(store.state.currentConfiguration, null, 4);

      return FileService.writeFile(store.state.configurationPath, content)
              .then(() => {
                store.commit("resetModification");
                store.commit("setConfigurationModified", false);
              });
    }
  },
  getters: {
    tests({ currentConfiguration }: any) {
      return currentConfiguration ? currentConfiguration.scenarios : [];
    },

    hasConfiguration({ currentConfiguration }: any) {
      return !!currentConfiguration;
    },

    hasTestBeenModified({testsModified}: any) {
      return (idx: number) => !!testsModified[idx];
    },

    hasConfigurationBeenModified({configurationModified}: any) {
      return configurationModified;
    },

    htmlReportDirectory({ currentConfiguration, configurationPath }: any) {
      const reportPath = currentConfiguration && currentConfiguration.paths &&
        currentConfiguration.paths.html_report || "";
      const prefixPath = configurationPath.substr(0, configurationPath.length - "backstop.json".length);
      return reportPath &&
            FileService.resolvePath([prefixPath, reportPath]) || "";
    },
  }
};
