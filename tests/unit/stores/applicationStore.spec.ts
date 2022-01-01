import { ApplicationInfo } from "@/models/applicationInfo";
import applicationStore from "@/store/applicationStore";
import store from "@/store/index";
import { ActionContext, ActionHandler } from "vuex";
import axios from "axios";
import { mocked } from "ts-jest/utils";

jest.mock("axios");
const mockedAxios = mocked(axios, true);

describe("applicationStore", () => {
  describe("applicationTitle", () => {
    it("should return nothing when there is no config loaded", () => {
      const state = {};
      const getters = {};
      const rootState = {};
      const rootGetters = {
        configurationStore: {
          configName: () => null
        }
      };

      const result = applicationStore.getters?.applicationTitle(state, getters, rootState, rootGetters);

      expect(result).toBe("");
    });

    it("should return the name of the config with saved, when there is no modif", () => {
      const state = {};
      const getters = {};
      const rootState = {
        configurationStore: {
          scriptsModified: false
        }
      };
      const rootGetters = {
        configurationStore: {
          configName: () => "config",
          hasConfigurationBeenModified: () => false
        }
      };

      const result = applicationStore.getters?.applicationTitle(state, getters, rootState, rootGetters);

      expect(result).toBe("config - Saved");
    });

    it("should return the name of the config with unsaved, when the config is modified", () => {
      const state = {};
      const getters = {};
      const rootState = {
        configurationStore: {
          scriptsModified: false
        }
      };
      const rootGetters = {
        configurationStore: {
          configName: () => "config",
          hasConfigurationBeenModified: () => true
        }
      };

      const result = applicationStore.getters?.applicationTitle(state, getters, rootState, rootGetters);

      expect(result).toBe("config - Unsaved");
    });

    it("should return the name of the config with unsaved, when the scripts are modified", () => {
      const state = {};
      const getters = {};
      const rootState = {
        configurationStore: {
          scriptsModified: true
        }
      };
      const rootGetters = {
        configurationStore: {
          configName: () => "config",
          hasConfigurationBeenModified: () => false
        }
      };

      const result = applicationStore.getters?.applicationTitle(state, getters, rootState, rootGetters);

      expect(result).toBe("config - Unsaved");
    });

    it("should return the name of the config with unsaved, when the config and the scripts are modified", () => {
      const state = {};
      const getters = {};
      const rootState = {
        configurationStore: {
          scriptsModified: true
        }
      };
      const rootGetters = {
        configurationStore: {
          configName: () => "config",
          hasConfigurationBeenModified: () => true
        }
      };

      const result = applicationStore.getters?.applicationTitle(state, getters, rootState, rootGetters);

      expect(result).toBe("config - Unsaved");
    });
  });

  describe("setSnackbarDisplayed", () => {
    it("should set state for a success snackbar", () => {
      const state = {
        snackbarText: "",
        snackbarDisplayed: false,
        snackbarSuccess: false
      };

      if (applicationStore.mutations) {
        applicationStore.mutations.setSnackbarDisplayed(state, { text: "test", success: true });
      }

      expect(state.snackbarDisplayed).toBeTruthy();
      expect(state.snackbarText).toBe("test");
      expect(state.snackbarSuccess).toBeTruthy();
    });

    it("should set state for an error snackbar", () => {
      const state = {
        snackbarText: "",
        snackbarDisplayed: false,
        snackbarSuccess: false
      };

      if (applicationStore.mutations) {
        applicationStore.mutations.setSnackbarDisplayed(state, { text: "test2", success: false });
      }

      expect(state.snackbarDisplayed).toBeTruthy();
      expect(state.snackbarText).toBe("test2");
      expect(state.snackbarSuccess).toBeFalsy();
    });
  });

  describe("hideSnackbar", () => {
    it("should set snackbar not displayed", () => {
      const state = {
        snackbarDisplayed: true
      };

      if (applicationStore.mutations) {
        applicationStore.mutations.hideSnackbar(state);
      }

      expect(state.snackbarDisplayed).toBeFalsy();
    });
  });

  describe("fillAppInfos", () => {
    it("should set app info", () => {
      const state = {
        appInfos: null
      };

      const appInfos = {
        appVersion: "1.2.3",
        backstopVersion: "4.5.6"
      };

      if (applicationStore.mutations) {
        applicationStore.mutations.fillAppInfos(state, appInfos);
      }

      expect(state.appInfos).toStrictEqual(new ApplicationInfo(appInfos));
    });
  });

  describe("displaySnackbar", () => {
    it("should display the snackbar and hides it after 15 seconds", () => {
      jest.useFakeTimers();
      const commit = jest.fn();
      const context: ActionContext<any, any> = {
        dispatch: jest.fn(),
        commit,
        state: {},
        getters: {},
        rootState: {},
        rootGetters: {}
      };
      (applicationStore.actions?.displaySnackbar as ActionHandler<any, any>)
        .call(store, context, { text: "test", success: true });

      expect(commit.mock.calls[0][0]).toBe("setSnackbarDisplayed");
      expect(commit.mock.calls[0][1]).toEqual({ text: "test", success: true });

      jest.runAllTimers();

      expect(commit.mock.calls[1][0]).toBe("hideSnackbar");
    });
  });

  describe("retrieveChangelog", () => {
    it("should retrieve the changelogs from GitHub", async() => {
      const commit = jest.fn();
      const context: ActionContext<any, any> = {
        dispatch: jest.fn(),
        commit,
        state: {},
        getters: {},
        rootState: {},
        rootGetters: {}
      };
      const response = { data: { body: "result of request" } };

      mockedAxios.get.mockImplementationOnce(() => Promise.resolve(response));

      let result = null;
      if (applicationStore.actions) {
        result = (applicationStore.actions.retrieveChangelog as ActionHandler<any, any>)
          .call(store, context, "1.2.3");
      }
      expect(mockedAxios.get).toHaveBeenCalledWith("https://api.github.com/repos/vince-f/lemu/releases/tags/v1.2.3");
      await expect(result).resolves.toEqual("result of request");
    });
  });
});
