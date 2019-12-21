import Vue from "vue";
import { DialogFileService } from '@/services/dialogFileService';
import { FileService } from "../services/fileService";
import { BackstopConfiguration } from '@/models/backstopConfiguration';
import { BackstopTest } from '@/models/backstopTest';


export default {
  namespaced: true,
  state: {
    currentConfiguration: null as BackstopConfiguration | null,
    configurationPath: "",
    testsModified: [] as boolean[],
    configurationModified: false
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
      for (let i = 0; i < state.currentConfiguration.scenarios.length; i++) {
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

    setConfigurationModified(state: any, modified: boolean) {
      state.configurationModified = false;
    }
  },
  actions: {
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
    }
  }
};
