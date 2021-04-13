import engineScriptStore from "@/store/engineScriptStore";
import { EngineScript } from "@/models/engineScript";
import store from "@/store/index";
import { ActionContext, ActionHandler } from "vuex";
import axios from "axios";
import { mocked } from 'ts-jest/utils';

describe("engineScriptStore", () => {
  describe("getScript", () => {
    it ("should return undefined when no script matches path", () => {
      const state = {
        scripts: []
      };
      const getters = {};
      const rootState = {};
      const rootGetters = {};

      const result = engineScriptStore.getters?.getScript(state, getters,
        rootState, rootGetters)("");

      expect(result).toBeUndefined();
    });

    it ("should return the script when it matches exactly path", () => {
      const script = new EngineScript("testPath", "");
      const state = {
        scripts: [
          script
        ]
      };
      const getters = {};
      const rootState = {};
      const rootGetters = {};

      const result = engineScriptStore.getters?.getScript(state, getters,
        rootState, rootGetters)("");

      expect(result).toBe(script);
    });
  });
});
