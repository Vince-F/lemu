import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import configurationStore from "./configurationStore";
import applicationStore from "./applicationStore";
import testResultStore from "./testResultStore";
import testRunnerStore from "./testRunnerStore";
import customScriptStore from "./customScriptStore";

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
    customScriptStore
  },
});
