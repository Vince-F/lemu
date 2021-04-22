import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { BackstopService } from "../services/backstopService";

@Module({
  namespaced: true
})
export default class TestRunnerStore extends VuexModule {
  public testRunning = false;

  @Mutation
  public setTestRunning(): void {
    this.testRunning = true;
  }

  @Mutation
  public setTestNotRunning(): void {
    this.testRunning = false;
  }

  @Action({ rawError: true })
  public runTests(): Promise<unknown> {
    this.context.commit("setTestRunning");
    return BackstopService.runTests(this.context.rootState.configurationStore.currentConfiguration)
      .then((result) => {
        return result;
      }).catch((error) => {
        return Promise.reject(new Error(error));
      }).finally(() => {
        this.context.commit("setTestNotRunning");
        this.context.commit("testResultStore/expireTestsResult", undefined, { root: true });
      });
  }

  @Action({ rawError: true })
  public runTest(testLabel: string): Promise<unknown> {
    this.context.commit("setTestRunning");
    return BackstopService.runTest(this.context.rootState.configurationStore.currentConfiguration, testLabel)
      .then((result) => {
        return result;
      }).catch((error) => {
        return Promise.reject(new Error(error));
      }).finally(() => {
        this.context.commit("setTestNotRunning");
        this.context.commit("testResultStore/expireTestsResult", undefined, { root: true });
      });
  }
}
