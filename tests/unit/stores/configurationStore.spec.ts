import { shallowMount } from '@vue/test-utils';
import configurationStore from '@/store/configurationStore';

describe('ConfigurationStore', () => {
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
