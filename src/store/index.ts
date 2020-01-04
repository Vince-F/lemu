import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import configurationStore from "./configrationStore";
import applicationStore from "./applicationStore";

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    configurationStore,
    applicationStore
  },
});
