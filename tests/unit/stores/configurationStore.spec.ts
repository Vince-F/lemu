import configurationStore from "@/store/configurationStore";
import { BackstopTest } from "@/models/backstopTest";
import { BackstopConfiguration } from "@/models/backstopConfiguration";

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
