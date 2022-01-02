import configurationStore from '@/store/configurationStore';
import { BackstopTest } from '@/models/backstopTest';
import store from "@/store/index";
import { ActionContext, ActionHandler } from "vuex";
import { BackstopService } from "@/services/backstopService";
import { DialogFileService } from "@/services/dialogFileService";
import { BackstopConfiguration } from "@/models/backstopConfiguration";
import { mocked } from 'ts-jest/utils';

jest.mock("@/services/backstopService");
const mockedBackstopService = mocked(BackstopService, true);

jest.mock("@/services/dialogFileService");
const mockedDialogFileService = mocked(DialogFileService, true);

describe("ConfigurationStore", () => {
  /* mutations */
  describe("addViewport", () => {
    it("should add empty viewport even if none existed before and says configuration is modified", () => {
      const state = {
        currentConfiguration: {} as BackstopConfiguration,
        configurationModified: false
      };
      if (configurationStore.mutations) {
        configurationStore.mutations.addViewport(state);
      }
      expect(state.configurationModified).toBeTruthy();
      expect(Array.isArray(state.currentConfiguration.viewports)).toBeTruthy();
      expect(state.currentConfiguration.viewports).toStrictEqual([{ label: "", width: 0, height: 0 }]);
    });

    it("should an empty viewport to the viewport list and says configuration is modified", () => {
      const state = {
        currentConfiguration: {
          viewports: [{ label: "test", width: 123, height: 456 }]
        },
        configurationModified: false
      };
      if (configurationStore.mutations) {
        configurationStore.mutations.addViewport(state);
      }
      expect(state.configurationModified).toBeTruthy();
      expect(Array.isArray(state.currentConfiguration.viewports)).toBeTruthy();
      expect(state.currentConfiguration.viewports).toStrictEqual([{ label: "test", width: 123, height: 456 }, { label: "", width: 0, height: 0 }]);
    });

    it("should do nothing when no configuration is loaded", () => {
      const state = {
        currentConfiguration: null,
        configurationModified: false
      };
      if (configurationStore.mutations) {
        configurationStore.mutations.addViewport(state);
      }
      expect(state.configurationModified).toBeFalsy();
      expect(state.currentConfiguration).toBeNull();
    });
  });

  describe("addScenario", () => {
    it("should add empty scenario in the existing list of scenario and says configuration is modified", () => {
      const state = {
        currentConfiguration: {
          scenarios: [
            { label: "Hello test" }
          ]
        },
        configurationModified: false
      };
      if (configurationStore.mutations) {
        configurationStore.mutations.addScenario(state);
      }
      expect(state.currentConfiguration.scenarios).toStrictEqual([{ label: "Hello test" }, new BackstopTest({ label: "New test 2" })]);
      expect(state.configurationModified).toBeTruthy();
    });

    it("should add empty scenario even if list doesn't exist and says configuration is modified", () => {
      const state = {
        currentConfiguration: {} as BackstopConfiguration,
        configurationModified: false
      };
      if (configurationStore.mutations) {
        configurationStore.mutations.addScenario(state);
      }
      expect(state.currentConfiguration.scenarios).toStrictEqual([new BackstopTest({ label: "New test 1" })]);
      expect(state.configurationModified).toBeTruthy();
    });

    it("should do nothing is configuration is not defined", () => {
      const state = {
        currentConfiguration: null,
        configurationModified: false
      };
      if (configurationStore.mutations) {
        configurationStore.mutations.addScenario(state);
      }
      expect(state.currentConfiguration).toBeNull();
      expect(state.configurationModified).toBeFalsy();
    });
  });

  describe("setSavingState", () => {
    it("should set state as saving", () => {
      const state = {
        isSaving: false
      };
      if (configurationStore.mutations) {
        configurationStore.mutations.setSavingState(state, true);
      }
      expect(state.isSaving).toBeTruthy();
    });
    it("should set state as not saving", () => {
      const state = {
        isSaving: true
      };
      if (configurationStore.mutations) {
        configurationStore.mutations.setSavingState(state, false);
      }
      expect(state.isSaving).toBeFalsy();
    });
  });

  describe("approveTests", () => {
    it("should not approve tests if they are running", () => {
      const commit = jest.fn();
      const context: ActionContext<any, any> = {
        dispatch: jest.fn(),
        commit,
        state: {},
        getters: {},
        rootState: {
          testRunnerStore: {
            testRunning: true
          }
        },
        rootGetters: {}
      };

      const result = (configurationStore.actions?.approveTests as ActionHandler<any, any>)
        .call(store, context);

      return expect(result).rejects.toEqual(new Error("Tests are running"));
    });

    it("should not approve and tells if there us no configuration", () => {
      const commit = jest.fn();
      const context: ActionContext<any, any> = {
        dispatch: jest.fn(),
        commit,
        state: {},
        getters: {},
        rootState: {
          testRunnerStore: {
            testRunning: false
          }
        },
        rootGetters: {}
      };

      const result = (configurationStore.actions?.approveTests as ActionHandler<any, any>)
        .call(store, context);

      return expect(result).rejects.toEqual(new Error("No configuration loaded"));
    });

    it("should approve all the tests", async () => {
      const configuration = {
        id: "test"
      };
      const commit = jest.fn();
      const context: ActionContext<any, any> = {
        dispatch: jest.fn(),
        commit,
        state: {
          currentConfiguration: configuration
        },
        getters: {},
        rootState: {
          testRunnerStore: {
            testRunning: false
          }
        },
        rootGetters: {}
      };

      mockedBackstopService.approveTests.mockImplementationOnce(() => Promise.resolve(undefined));

      const result = (configurationStore.actions?.approveTests as ActionHandler<any, any>)
        .call(store, context);

      await expect(result).resolves.toEqual(undefined);
      expect(mockedBackstopService.approveTests).toHaveBeenCalledWith(configuration);
    });
  });

  describe("approveTest", () => {
    it("should not approve tests if they are running", () => {
      const commit = jest.fn();
      const context: ActionContext<any, any> = {
        dispatch: jest.fn(),
        commit,
        state: {},
        getters: {},
        rootState: {
          testRunnerStore: {
            testRunning: true
          }
        },
        rootGetters: {}
      };

      const result = (configurationStore.actions?.approveTest as ActionHandler<any, any>)
        .call(store, context, "testLabel");

      return expect(result).rejects.toEqual(new Error("Tests are running"));
    });

    it("should not approve and tells if there us no configuration", () => {
      const commit = jest.fn();
      const context: ActionContext<any, any> = {
        dispatch: jest.fn(),
        commit,
        state: {},
        getters: {},
        rootState: {
          testRunnerStore: {
            testRunning: false
          }
        },
        rootGetters: {}
      };

      const result = (configurationStore.actions?.approveTest as ActionHandler<any, any>)
        .call(store, context, "testLabel");

      return expect(result).rejects.toEqual(new Error("No configuration loaded"));
    });

    it("should approve the test for one test", async () => {
      const configuration = {
        id: "test"
      };
      const commit = jest.fn();
      const context: ActionContext<any, any> = {
        dispatch: jest.fn(),
        commit,
        state: {
          currentConfiguration: configuration
        },
        getters: {},
        rootState: {
          testRunnerStore: {
            testRunning: false
          }
        },
        rootGetters: {}
      };

      mockedBackstopService.approveTest.mockImplementationOnce(() => Promise.resolve(undefined));

      const result = (configurationStore.actions?.approveTest as ActionHandler<any, any>)
        .call(store, context, "testLabel");

      await expect(result).resolves.toEqual(undefined);
      expect(mockedBackstopService.approveTest).toHaveBeenCalledWith(configuration, "testLabel");
    });
  });

  describe("approveTestViewport", () => {
    it("should not approve tests if they are running", () => {
      const commit = jest.fn();
      const context: ActionContext<any, any> = {
        dispatch: jest.fn(),
        commit,
        state: {},
        getters: {},
        rootState: {
          testRunnerStore: {
            testRunning: true
          }
        },
        rootGetters: {}
      };

      const result = (configurationStore.actions?.approveTestViewport as ActionHandler<any, any>)
        .call(store, context, { testLabel: "testLabel", viewportLabel: "viewportLabel" });

      return expect(result).rejects.toEqual(new Error("Tests are running"));
    });

    it("should not approve and tells if there us no configuration", () => {
      const commit = jest.fn();
      const context: ActionContext<any, any> = {
        dispatch: jest.fn(),
        commit,
        state: {},
        getters: {},
        rootState: {
          testRunnerStore: {
            testRunning: false
          }
        },
        rootGetters: {}
      };

      const result = (configurationStore.actions?.approveTestViewport as ActionHandler<any, any>)
        .call(store, context, { testLabel: "testLabel", viewportLabel: "viewportLabel" });

      return expect(result).rejects.toEqual(new Error("No configuration loaded"));
    });

    it("should approve the test for one viewport", async () => {
      const configuration = {
        id: "test"
      };
      const commit = jest.fn();
      const context: ActionContext<any, any> = {
        dispatch: jest.fn(),
        commit,
        state: {
          currentConfiguration: configuration
        },
        getters: {},
        rootState: {
          testRunnerStore: {
            testRunning: false
          }
        },
        rootGetters: {}
      };

      mockedBackstopService.approveTest.mockImplementationOnce(() => Promise.resolve(undefined));

      const result = (configurationStore.actions?.approveTestViewport as ActionHandler<any, any>)
        .call(store, context, { testLabel: "testLabel", viewportLabel: "viewportLabel" });

      await expect(result).resolves.toEqual(undefined);
      expect(mockedBackstopService.approveTest)
        .toHaveBeenCalledWith(configuration, "testLabel", "viewportLabel");
    });
  });

  describe("initConfig", () => {

  });

  describe("openConfiguration", () => {
    it("should reject when dialog is rejected (closed for instance)", async () => {
      const commit = jest.fn();
      const dispatch = jest.fn();
      const context: ActionContext<any, any> = {
        dispatch,
        commit,
        state: {},
        getters: {},
        rootState: {},
        rootGetters: {}
      };

      mockedDialogFileService.openFileDialog.mockImplementationOnce(() => Promise.reject());

      const result = (configurationStore.actions?.openConfiguration as ActionHandler<any, any>)
        .call(store, context);

      await expect(result).rejects.toEqual(undefined);

      expect(mockedDialogFileService.openFileDialog).toHaveBeenCalled();
      expect(commit).toHaveBeenCalledTimes(0);
      expect(dispatch).toHaveBeenCalledTimes(0);
    });

    it("should reject when opened file is not a backstop configuration", async () => {
      const commit = jest.fn();
      const dispatch = jest.fn();
      const context: ActionContext<any, any> = {
        dispatch,
        commit,
        state: {},
        getters: {},
        rootState: {},
        rootGetters: {}
      };

      mockedDialogFileService.openFileDialog.mockImplementationOnce(() =>
        Promise.resolve({ path: "path", content: {} }));

      const result = (configurationStore.actions?.openConfiguration as ActionHandler<any, any>)
        .call(store, context);

      await expect(result).rejects.toEqual(new Error("File doesn't look like a BackstopJS configuration"));

      expect(mockedDialogFileService.openFileDialog).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledTimes(0);
      expect(commit).toHaveBeenCalledTimes(0);
    });

    it("should open configuration and set path", async () => {
      const configuration = { id: "test", scenarios: [] };
      const commit = jest.fn();
      const dispatch = jest.fn();
      const context: ActionContext<any, any> = {
        dispatch,
        commit,
        state: {},
        getters: {
          backstopConfigurationDirectory: "configurationPath"
        },
        rootState: {},
        rootGetters: {}
      };

      mockedDialogFileService.openFileDialog.mockImplementationOnce(
        () => Promise.resolve({ path: "path", content: configuration }));

      const result = (configurationStore.actions?.openConfiguration as ActionHandler<any, any>)
        .call(store, context);

      await expect(result).resolves.toEqual(undefined);

      expect(commit).toHaveBeenCalledTimes(1);
      expect(dispatch).toHaveBeenCalledTimes(1);

      expect(commit.mock.calls[0][0]).toBe("setFullConfiguration");
      expect(commit.mock.calls[0][1]).toEqual(configuration);


      expect(dispatch.mock.calls[0][0]).toBe("setContextAfterConfigLoaded");
      expect(dispatch.mock.calls[0][1]).toEqual("path");
    });
  });

  describe("openConfigurationFromPath", () => {

  });

  describe("saveConfiguration", () => {

  });
  /* getters */
  describe("tests", () => {
    it("should get the scenarios from the current configuration", () => {
      const scenarios = [{ label: "test", url: "someUrl" }];
      const state = {
        currentConfiguration: {
          scenarios
        }
      };

      let result = null;
      if (configurationStore.getters) {
        result = configurationStore.getters.tests(state, {}, {}, {});
      }
      expect(result).toEqual(scenarios);
    });

    it("should return an empty array is not config is loaded", () => {
      const state = {};

      let result = null;
      if (configurationStore.getters) {
        result = configurationStore.getters?.tests(state, {}, {}, {});
      }
      expect(result).toEqual([]);
    });
  });

  describe("hasConfiguration", () => {
    it("should return true when there is a config loaded", () => {
      const state = {
        currentConfiguration: {}
      };

      let result;
      if (configurationStore.getters) {
        result = configurationStore.getters?.hasConfiguration(state, {}, {}, {});
      }
      expect(result).toBeTruthy();
    });

    it("should return false when there is no config", () => {
      const state = {};

      let result;
      if (configurationStore.getters) {
        result = configurationStore.getters?.hasConfiguration(state, {}, {}, {});
      }
      expect(result).toBeFalsy();
    });
  });

  describe("hasTestBeenModified", () => {
    it("should say the test is not modified by default", () => {
      const state = {
        testsModified: []
      };

      let result;
      if (configurationStore.getters) {
        result = configurationStore.getters?.hasTestBeenModified(state, {}, {}, {})(0);
      }
      expect(result).toBeFalsy();
    });

    it("should say the test is modified if it is mark as modified", () => {
      const state = {
        testsModified: [true]
      };

      let result;
      if (configurationStore.getters) {
        result = configurationStore.getters?.hasTestBeenModified(state, {}, {}, {})(0);
      }
      expect(result).toBeTruthy();
    });
  });

  describe("hasConfigurationBeenModified", () => {
    it("should return configuration is not modified by default", () => {
      const state = {};

      let result;
      if (configurationStore.getters) {
        result = configurationStore.getters?.hasConfigurationBeenModified(state, {}, {}, {});
      }
      expect(result).toBeFalsy();
    });

    it("should return configuration is modified if it has been modified", () => {
      const state = {
        configurationModified: true
      };

      let result;
      if (configurationStore.getters) {
        result = configurationStore.getters?.hasConfigurationBeenModified(state, {}, {}, {});
      }
      expect(result).toBeTruthy();
    });
  });
});
