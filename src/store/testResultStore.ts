import { BackstopTestResult } from "@/models/backstopTestResult";
import { BackstopService } from "@/services/backstopService";
import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";

@Module({
  namespaced: true
})
export default class TestResultStore extends VuexModule {
  public testsResult: BackstopTestResult[] = [];
  public resultExpired = true;

  @Mutation
  public expireTestsResult(): void {
    this.resultExpired = true;
  }

  @Mutation
  public setTestsResult(result: BackstopTestResult[]): void {
    this.testsResult = result;
    this.resultExpired = false;
  }

  public get getResultByTestLabel(): (labelName: string) => BackstopTestResult[] {
    return (labelName: string) => {
      return this.testsResult.filter((testResult: BackstopTestResult) => {
        return testResult.pair.label === labelName;
      });
    };
  }

  @Action
  public retrieveTestsResult(): Promise<void | BackstopTestResult[]> {
    if (this.testsResult && this.testsResult.length > 0 &&
        !this.resultExpired) {
      return Promise.resolve(this.testsResult);
    }

    return BackstopService.retrieveTestsResult(this.context.rootGetters["configurationStore/htmlReportDirectory"])
      .then((reportResult) => {
        this.context.commit("setTestsResult", reportResult.testsResult);
      });
  }

  @Action
  public watchResultChange(): void {
    BackstopService.registerResultWatcher(this.context.rootGetters["configurationStore/htmlReportDirectory"], () => {
      this.context.commit("expireTestsResult");
    });
  }
}
