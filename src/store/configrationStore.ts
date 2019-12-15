import Vue from "vue";
import { DialogFileService } from '@/services/dialogFileService';
import { FileService } from "../services/fileService";
import { BackstopConfiguration } from '@/models/backstopConfiguration';
import { BackstopTest } from '@/models/backstopTest';


export default {
  namespaced: true,
  state: {
    currentConfiguration: null as BackstopConfiguration | null,
    configurationPath: ""
  },
  mutations: {
    addViewport(state: any) {
      if (state.currentConfiguration) {
        state.currentConfiguration.viewports.push({label: "", width: 0, height: 0});
      }
    },

    addScenario(state: any) {
      if (state.currentConfiguration.scenarios) {
        const label = "New test " + (state.currentConfiguration.scenarios.length + 1);
        state.currentConfiguration.scenarios.push(new BackstopTest({ label }));
      }
    },
    
    dismissCurrentConfiguration(state: any) {
      state.currentConfiguration = null;
      state.configurationPath = "";
    },

    duplicateScenario(state: any, scenarioIndex: number) {
      if (state.currentConfiguration.scenarios) {
        const currentTest = state.currentConfiguration.scenarios[scenarioIndex];
        const testLabelPrefix = currentTest.label + "Copy";
        const nbOfCopies = state.currentConfiguration.scenarios.filter((entry) => {
          return entry.label.indexOf(testLabelPrefix) === 0;
        }).length;
        let testLabelName = currentTest.label + "Copy";
        if (nbOfCopies > 0) {
          testLabelName += nbOfCopies;
        }
        const newTest = new BackstopTest(currentTest);
        newTest.label = testLabelName;
        state.currentConfiguration.scenarios.push(newTest);
      }
    },

    dismissCurrentConfiguration(state: any) {
      state.currentConfiguration = null;
      state.configurationPath = "";
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
      }
    },

    setFullConfiguration(state: any, { newConfiguration }: any) {
      state.currentConfiguration = newConfiguration;
    },

    setPath(state: any, path: string) {
      state.configurationPath = path;
    },

    setConfigurationField(state: any, { field, value }: { field: string, value: any }) {
      if (state.currentConfiguration) {
        const obj = {} as any;
        obj[field] = value;
        Object.assign(state.currentConfiguration, obj);
      }
    },

    setConfigurationPathField(state: any, { field, value }: { field: string, value: any }) {
      if (state.currentConfiguration.paths) {
        const obj = {} as any;
        obj[field] = value;
        Object.assign(state.currentConfiguration.paths, obj);
      }
    },

    setConfigurationReport(state: any, {reportType, kept}: {reportType: string, kept: boolean}) {
      const idx = state.currentConfiguration.report.indexOf(reportType);
      if (kept && idx === -1) {
        state.currentConfiguration.report.push(reportType);
      } else if (!kept && idx !== -1) {
        state.currentConfiguration.report.splice(idx, 1);
      }
    },

    setConfigurationViewportField(
      state: any,
      { viewportIndex, field, value }: { viewportIndex: number, field: string, value: any }
    ) {
      if (state.currentConfiguration.viewports) {
        Vue.set(state.currentConfiguration.viewports[viewportIndex], field, value);
      }
    },

    setScenarioField(
      state: any,
      {scenarioIndex, field, value}: {scenarioIndex: number, field: string, value: any}
    ) {
      if (state.currentConfiguration.scenarios) {
        Vue.set(state.currentConfiguration.scenarios[scenarioIndex], field, value);
      }
    },

    removeScenario(state: any, index: number) {
      if (state.currentConfiguration.scenarios) {
        state.currentConfiguration.scenarios.splice(index, 1);
      }
    },

    removeViewport(state: any, index: number) {
      if (state.currentConfiguration) {
        state.currentConfiguration.viewports.splice(index, 1);
      }
    }
  },
  actions: {
    openConfiguration(store: any) {
      return DialogFileService.openFileDialog()
        .then(({ path, content }) => {
          store.commit("setFullConfiguration", {
            newConfiguration: content
          });
          store.commit("setPath", path);
        });
    },

    saveConfiguration(store: any) {
      const content = JSON.stringify(store.state.currentConfiguration, null, 4);

      return FileService.writeFile(store.state.configurationPath, content);
    }
  },
  getters: {
    tests({ currentConfiguration }: any) {
      return currentConfiguration ? currentConfiguration.scenarios : [];
    },

    hasConfiguration({ currentConfiguration }: any) {
      return !!currentConfiguration;
    }
  }
};
