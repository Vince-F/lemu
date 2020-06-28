import { Module, VuexModule, Action, Mutation } from "vuex-module-decorators";
// @ts-ignore
const electron = window.require("electron");

@Module({
  namespaced: true
})
export default class TestLogStore extends VuexModule {
  public logs: Array<{message: string, time: Date, level: string}> = [];

  @Mutation
  public addLog(log: {message: string, level: string}) {
    this.logs.push({message: log.message, level: log.level, time: new Date()});
  }

  @Mutation
  public resetLogs() {
    this.logs = [];
  }

  @Action
  public initializeLogListener() {
    electron.ipcRenderer.on("testLog", (event: EventListenerOrEventListenerObject,
                                        data: {level: "info" | "error", message: string}) => {
      const message = ( data.level === "error" ? "ERROR: " : "" ) + data.message;
      this.context.commit("addLog", {message, level: data.level});
    });
  }
}
