import configurationStore from '@/store/configurationStore';
import { BackstopTest } from '@/models/backstopTest';

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
});
