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

  describe("addScript", () => {
    it("should add the script in the list (linux-like path)", () => {
      const path = "path/to/file";
      const content = "test";
      const state = {
        scripts: [],
        scriptsModified: false
      };

      if (engineScriptStore.mutations) {
        engineScriptStore.mutations.addScript(state,
          {
            scriptPath: path,
            content
          });
      }

      expect(state.scripts).toEqual([new EngineScript(path, content)]);
      expect(state.scriptsModified).toBeTruthy();
    });

    it("should add the script in the list (windows-like path)", () => {
      const pathLinux = "path/to/file";
      const pathWindows = "path\\to\\file";
      const content = "test";
      const state = {
        scripts: [],
        scriptsModified: false
      };

      if (engineScriptStore.mutations) {
        engineScriptStore.mutations.addScript(state,
          {
            scriptPath: pathWindows,
            content
          });
      }

      expect(state.scripts).toEqual([new EngineScript(pathLinux, content)]);
      expect(state.scriptsModified).toBeTruthy();
    });
  });

  describe("cleanAfterSave", () => {
    it("should reset the list of modified script and save flag", () => {
      const state = {
        scriptsModified: true,
        removedScriptsPath: [
          "abcde",
          "xyz"
        ]
      };

      if (engineScriptStore.mutations) {
        engineScriptStore.mutations.cleanAfterSave(state);
      }

      expect(state.removedScriptsPath).toEqual([]);
      expect(state.scriptsModified).toBeFalsy();
    });
  });

  describe("removeScript", () => {
    it("should remove the script in the list (linux-like path)", () => {
      const path = "path/to/file";
      const content = "test";
      const state = {
        scripts: [
          new EngineScript(path, content),
          new EngineScript(path + "2", content + "2")
        ],
        removedScriptsPath: [],
        scriptsModified: false
      };

      if (engineScriptStore.mutations) {
        engineScriptStore.mutations.removeScript(state, path);
      }

      expect(state.scripts).toEqual([new EngineScript(path + "2", content + "2")]);
      expect(state.removedScriptsPath).toEqual([path]);
      expect(state.scriptsModified).toBeTruthy();
    });

    it("should remove the script in the list (windows-like path)", () => {
      const pathLinux = "path/to/file";
      const pathWindows = "path\\to\\file";
      const content = "test";
      const state = {
        scripts: [
          new EngineScript(pathWindows, content),
          new EngineScript(pathLinux + "2", content + "2")
        ],
        removedScriptsPath: [],
        scriptsModified: false
      };

      if (engineScriptStore.mutations) {
        engineScriptStore.mutations.removeScript(state, pathLinux);
      }

      expect(state.scripts).toEqual([new EngineScript(pathLinux + "2", content + "2")]);
      expect(state.removedScriptsPath).toEqual([pathWindows]);
      expect(state.scriptsModified).toBeTruthy();
    });

    it("should do nothing if the path doesn't match any script", () => {
      const path = "path/to/file";
      const content = "test";
      const scripts = [
        new EngineScript(path, content),
        new EngineScript(path + "2", content + "2")
      ];
      const state = {
        scripts,
        scriptsModified: false
      };

      if (engineScriptStore.mutations) {
        engineScriptStore.mutations.removeScript(state, "fake/path");
      }

      expect(state.scripts).toEqual(scripts);
      expect(state.scriptsModified).toBeFalsy();
    });
  });

  describe("setEngineScripts", () => {
    it("should set all the scripts and replace any windows-like path to linux-like path", () => {
      const pathLinux = "path/to/file";
      const pathWindows = "path\\to\\file";
      const content = "test";
      const scripts = [
        new EngineScript(pathLinux, content),
        new EngineScript(pathWindows, content + "2")
      ];
      const state = {
        scripts: [],
        scriptsModified: false
      };

      if (engineScriptStore.mutations) {
        engineScriptStore.mutations.setEngineScripts(state, scripts);
      }

      expect(state.scripts).toEqual([
        new EngineScript(pathLinux, content),
        new EngineScript(pathLinux, content + "2")
      ]);
      expect(state.scriptsModified).toBeTruthy();
    });
  });

  describe("setScriptContent", () => {

  });

  describe("addActionScript", () => {

  });

  describe("retrieveEngineScripts", () => {

  });

  describe("saveAllScripts", () => {

  });
});
