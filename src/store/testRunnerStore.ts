import { BackstopService } from "../services/backstopService";

export default {
  namespaced: true,
  state: {
    testRunning: false
  },
  mutations: {
    runTest(state: any) {
      state.testRunning = true;
    },

    stopTest(state: any) {
      state.testRunning = false;
    }
  },
  actions: {
    runTests({commit, state, rootState}: any) {
      commit("runTest");
      return BackstopService.runTests(rootState.configurationStore.currentConfiguration)
        .then((result) => {
          return result;
        }).catch((error) => {
          return Promise.reject(error);
        }).finally(() => {
          commit("stopTest");
          commit("testResultStore/expireTestsResult", undefined, {root: true});
        });
    },

    runTest({commit, state, rootState}: any, testLabel: string) {
      commit("runTest");
      return BackstopService.runTest(rootState.configurationStore.currentConfiguration, testLabel)
        .then((result) => {
          return result;
        }).catch((error) => {
          return Promise.reject(error);
        }).finally(() => {
          commit("stopTest");
          commit("testResultStore/expireTestsResult", undefined, {root: true});
        });
    },
  }
}