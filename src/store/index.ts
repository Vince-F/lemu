import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import configurationStore from "./configurationStore";
import applicationStore from "./applicationStore";
import testResultStore from "./testResultStore";
import testRunnerStore from "./testRunnerStore";
import testLogStore from "./testLogStore";
import engineScriptStore from "./engineScriptStore";
import templateStore from "./templateStore";
import settingsStore from "./settingsStore";

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    configurationStore,
    applicationStore,
    testResultStore,
    testRunnerStore,
    testLogStore,
    engineScriptStore,
    templateStore,
    settingsStore
  },
});
