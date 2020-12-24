import { ApplicationInfo } from "@/models/applicationInfo";
import applicationStore from "@/store/applicationStore";
import store from "@/store/index";
import {ActionContext, ActionHandler} from "vuex";

describe("applicationStore", () => {
  describe("setSnackbarDisplayed", () => {
    it ("should set state for a success snackbar", () => {
      const state = {
        snackbarText: "",
        snackbarDisplayed: false,
        snackbarSuccess: false
      };

      applicationStore.mutations?.setSnackbarDisplayed(state, {text: "test", success: true});

      expect(state.snackbarDisplayed).toBeTruthy();
      expect(state.snackbarText).toBe("test");
      expect(state.snackbarSuccess).toBeTruthy();
    });

    it ("should set state for an error snackbar", () => {
      const state = {
        snackbarText: "",
        snackbarDisplayed: false,
        snackbarSuccess: false
      };

      applicationStore.mutations?.setSnackbarDisplayed(state, {text: "test2", success: false});

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

      applicationStore.mutations?.hideSnackbar(state);

      expect(state.snackbarDisplayed).toBeFalsy();
    });
  });

  describe("fillAppInfos", () => {
    it ("should set app info", () => {
      const state = {
        appInfos: null
      };

      const appInfos = {
        appVersion: "1.2.3",
        backstopVersion: "4.5.6"
      };

      applicationStore.mutations?.fillAppInfos(state, appInfos);

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
        .call(store, context, {text: "test", success: true});

      expect(commit.mock.calls[0][0]).toBe("setSnackbarDisplayed");
      expect(commit.mock.calls[0][1]).toEqual({text: "test", success: true});

      jest.runAllTimers();

      expect(commit.mock.calls[1][0]).toBe("hideSnackbar");
    });
  });
});
