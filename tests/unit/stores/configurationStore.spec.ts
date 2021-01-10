import configurationStore from '@/store/configurationStore';
import { BackstopTest } from '@/models/backstopTest';
import store from "@/store/index";
import { ActionContext, ActionHandler } from "vuex";
import { BackstopService } from "@/services/backstopService";
import { DialogFileService } from "@/services/dialogFileService";
import { mocked } from 'ts-jest/utils';

jest.mock("@/services/backstopService");
const mockedBackstopService = mocked(BackstopService, true);


jest.mock("@/services/dialogFileService");
const mockedDialogFileService = mocked(DialogFileService, true);

describe('ConfigurationStore', () => {
  describe("addViewport", () => {
    it("should add empty viewport even if none existed before and says configuration is modified", () => {
      const state = {
        currentConfiguration: {} as any,
        configurationModified: false
      };
      configurationStore.mutations?.addViewport(state);
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
      configurationStore.mutations?.addViewport(state);
      expect(state.configurationModified).toBeTruthy();
      expect(Array.isArray(state.currentConfiguration.viewports)).toBeTruthy();
      expect(state.currentConfiguration.viewports).toStrictEqual([{ label: "test", width: 123, height: 456 }, { label: "", width: 0, height: 0 }]);
    });

    it("should do nothing when no configuration is loaded", () => {
      const state = {
        currentConfiguration: null,
        configurationModified: false
      };
      configurationStore.mutations?.addViewport(state);
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
      configurationStore.mutations?.addScenario(state);
      expect(state.currentConfiguration.scenarios).toStrictEqual([{ label: "Hello test" }, new BackstopTest({ label: "New test 2"})]);
      expect(state.configurationModified).toBeTruthy();
    });

    it("should add empty scenario even if list doesn't exist and says configuration is modified", () => {
      const state = {
        currentConfiguration: {} as any,
        configurationModified: false
      };
      configurationStore.mutations?.addScenario(state);
      expect(state.currentConfiguration.scenarios).toStrictEqual([new BackstopTest({ label: "New test 1" })]);
      expect(state.configurationModified).toBeTruthy();
    });

    it("should do nothing is configuration is not defined", () => {
      const state = {
        currentConfiguration: null,
        configurationModified: false
      };
      configurationStore.mutations?.addScenario(state);
      expect(state.currentConfiguration).toBeNull();
      expect(state.configurationModified).toBeFalsy();
    });
  });

  describe("setSavingState", () => {
    it("should set state as saving", () => {
      const state = {
        isSaving: false
      };
      configurationStore.mutations?.setSavingState(state, true);
      expect(state.isSaving).toBeTruthy();
    });
    it("should set state as not saving", () => {
      const state = {
        isSaving: true
      };
      configurationStore.mutations?.setSavingState(state, false);
      expect(state.isSaving).toBeFalsy();
    });
  });

  describe("approveTests", () => {
    it ("should not approve tests if they are running", () => {
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

      expect(result).rejects.toEqual("Tests are running");
    });

    it ("should not approve and tells if there us no configuration", () => {
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

      expect(result).rejects.toEqual("No configuration loaded");
    });

    it ("should approve all the tests", () => {
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

      mockedBackstopService.approveTests.mockImplementationOnce(() => Promise.resolve("12"));

      const result = (configurationStore.actions?.approveTests as ActionHandler<any, any>)
        .call(store, context);

      expect(result).resolves.toEqual(undefined);
      expect(mockedBackstopService.approveTests).toHaveBeenCalledWith(configuration);
    });
  });

  describe("approveTest", () => {
    it ("should not approve tests if they are running", () => {
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

      expect(result).rejects.toEqual("Tests are running");
    });

    it ("should not approve and tells if there us no configuration", () => {
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

      expect(result).rejects.toEqual("No configuration loaded");
    });

    it ("should approve all the tests", () => {
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

      mockedBackstopService.approveTest.mockImplementationOnce(() => Promise.resolve());

      const result = (configurationStore.actions?.approveTest as ActionHandler<any, any>)
        .call(store, context, "testLabel");

      expect(result).resolves.toEqual(undefined);
      expect(mockedBackstopService.approveTest).toHaveBeenCalledWith(configuration, "testLabel");
    });
  });

  describe("approveTestViewport", () => {
    it ("should not approve tests if they are running", () => {
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
        .call(store, context, {testLabel: "testLabel", viewportLabel: "viewportLabel"});

      expect(result).rejects.toEqual("Tests are running");
    });

    it ("should not approve and tells if there us no configuration", () => {
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
        .call(store, context, {testLabel: "testLabel", viewportLabel: "viewportLabel"});

      expect(result).rejects.toEqual("No configuration loaded");
    });

    it ("should approve all the tests", () => {
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

      mockedBackstopService.approveTest.mockImplementationOnce(() => Promise.resolve());

      const result = (configurationStore.actions?.approveTestViewport as ActionHandler<any, any>)
        .call(store, context, {testLabel: "testLabel", viewportLabel: "viewportLabel"});

      expect(result).resolves.toEqual(undefined);
      expect(mockedBackstopService.approveTest).toHaveBeenCalledWith(configuration, "testLabel", "viewportLabel");
    });
  });

  describe("initConfig", () => {

  });

  describe("openConfiguration", () => {
    it ("should reject when dialog is rejected (closed for instance)", async () => {
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

    it ("should reject when opened file is not a backstop configuration", async () => {
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

      mockedDialogFileService.openFileDialog.mockImplementationOnce(() => Promise.resolve({path: "path", content: {}}));

      const result = (configurationStore.actions?.openConfiguration as ActionHandler<any, any>)
        .call(store, context);

      await expect(result).rejects.toEqual("File doesn't look like a BackstopJS configuration");

      expect(mockedDialogFileService.openFileDialog).toHaveBeenCalled();
      expect(dispatch).toHaveBeenCalledTimes(0);
      expect(commit).toHaveBeenCalledTimes(0);
    });

    it ("should open configuration and set path", async () => {
      const configuration = {id: "test", scenarios: []};
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
        () => Promise.resolve({path: "path", content: configuration}));
      mockedBackstopService.setWorkingDir.mockImplementationOnce(jest.fn());

      const result = (configurationStore.actions?.openConfiguration as ActionHandler<any, any>)
        .call(store, context);

      await expect(result).resolves.toEqual(undefined);

      expect(commit).toHaveBeenCalledTimes(5);
      expect(dispatch).toHaveBeenCalledTimes(1);

      expect(commit.mock.calls[0][0]).toBe("setFullConfiguration");
      expect(commit.mock.calls[0][1]).toEqual({newConfiguration: configuration});

      expect(commit.mock.calls[1][0]).toBe("setPath");
      expect(commit.mock.calls[1][1]).toEqual("path");

      expect(commit.mock.calls[2][0]).toBe("updateRecently");
      expect(commit.mock.calls[2][1]).toEqual("path");

      expect(commit.mock.calls[3][0]).toBe("testLogStore/resetLogs");
      expect(commit.mock.calls[3][2]).toEqual({root: true});

      expect(commit.mock.calls[4][0]).toBe("testResultStore/expireTestsResult");
      expect(commit.mock.calls[4][2]).toEqual({root: true});

      expect(dispatch.mock.calls[0][0]).toBe("testResultStore/watchResultChange");
      expect(dispatch.mock.calls[0][2]).toEqual({root: true});

      expect(mockedBackstopService.setWorkingDir).toHaveBeenCalledWith("configurationPath");
    });
  });

  describe("openConfigurationFromPath", () => {

  });

  describe("saveConfiguration", () => {

  });
});
