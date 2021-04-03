import { Module, VuexModule, Action, Mutation } from "vuex-module-decorators";

@Module({
  namespaced: true
})
export default class TestLogStore extends VuexModule {
  public logs: Array<{message: string, time: Date, level: string}> = [];

  @Mutation
  public addLog(log: {message: string, level: string}): void {
    this.logs.push({ message: log.message, level: log.level, time: new Date(Date.now()) });
  }

  @Mutation
  public resetLogs(): void {
    this.logs = [];
  }

  @Action
  public initializeLogListener(): void {
    window.ipcHandler.receive("testLog", (event: EventListenerOrEventListenerObject,
      data: {level: "info" | "error", message: string}) => {
      const message = (data.level === "error" ? "ERROR: " : "") + data.message;
      this.context.commit("addLog", { message, level: data.level });
    });
  }
}
