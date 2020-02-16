import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { BackstopService } from "../services/backstopService";

@Module({
  namespaced: true
})
export default class TestRunnerStore extends VuexModule {
  public testRunning: boolean = false;

  @Mutation
  public setTestRunning() {
    this.testRunning = true;
  }

  @Mutation
  public setTestNotRunning() {
    this.testRunning = false;
  }

  @Action({rawError: true})
  public runTests() {
    this.context.commit("setTestRunning");
    return BackstopService.runTests(this.context.rootState.configurationStore.currentConfiguration)
        .then((result) => {
          return result;
        }).catch((error) => {
          return Promise.reject(error);
        }).finally(() => {
          this.context.commit("setTestNotRunning");
          this.context.commit("testResultStore/expireTestsResult", undefined, {root: true});
        });
  }

  @Action({rawError: true})
  public runTest(testLabel: string) {
    this.context.commit("setTestRunning");
    return BackstopService.runTest(this.context.rootState.configurationStore.currentConfiguration, testLabel)
      .then((result) => {
        return result;
      }).catch((error) => {
        return Promise.reject(error);
      }).finally(() => {
        this.context.commit("setTestNotRunning");
        this.context.commit("testResultStore/expireTestsResult", undefined, {root: true});
      });
  }
}
