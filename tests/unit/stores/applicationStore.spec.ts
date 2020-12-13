import { ApplicationInfo } from "@/models/applicationInfo";
import applicationStore from "@/store/applicationStore";

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
});
