import { BackstopService } from "../services/backstopService";

export default {
  namespace: true,
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
    runTests({commit, state}: any) {
      commit("runTest");
      return BackstopService.runTests(state.currentConfiguration)
        .then((result) => {
          return result;
        }).catch((error) => {
          return Promise.reject(error);
        }).finally(() => {
          commit("stopTest");
          commit("testResultStore/expireTestsResult", undefined, {root: true});
        });
    },

    runTest({commit, state}: any, testLabel: string) {
      commit("runTest");
      return BackstopService.runTest(state.currentConfiguration, testLabel)
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