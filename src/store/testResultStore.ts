import { BackstopTestResult } from '@/models/backstopTestResult';
import { BackstopService } from '@/services/backstopService';
import { BackstopReport } from '@/models/backstopReport';


export default {
  namespaced: true,
  state: {
    testsResult: [] as BackstopTestResult[],
    resultExpired: true
  },
  mutations: {
    setTestsResult(state: any, result: BackstopTestResult[]) {
      state.testsResult = result;
      state.resultExpired = false;
    }
  },
  actions: {
    retrieveTestsResult({commit, state, rootGetters}: any) {
      if (state.testsResult && state.testsResult.length > 0 && !state.resultExpired) {
        return Promise.resolve(state.testsResult);
      }

      return BackstopService.retrieveTestsResult(rootGetters["configurationStore/htmlReportDirectory"])
        .then((reportResult) => {
          commit("setTestsResult", reportResult.testsResult);
        });
    }
  },
  getters: {
    getTestByLabel({testsResult}: any) {
      return (labelName: string) => {
        return testsResult.filter((testResult: BackstopTestResult) => {
          return testResult.pair.label === labelName;
        });
      };
    }
  }
};
