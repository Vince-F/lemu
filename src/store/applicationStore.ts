import { ApplicationService } from "@/services/applicationService";
import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import axios from "axios";
import { ApplicationInfo } from '@/models/applicationInfo';

@Module({
  namespaced: true
})
export default class ApplicationStore extends VuexModule {
  public snackbarText: string = "";
  public snackbarDisplayed: boolean = false;
  public snackbarSuccess: boolean = false;
  public appInfos: ApplicationInfo | null = null;

  public get applicationTitle(): string {
    const configName = this.context.rootGetters["configurationStore/configName"];
    if (configName) {
      const modified = this.context.rootGetters["configurationStore/hasConfigurationBeenModified"] ||
        this.context.rootState.configurationStore.scriptsModified;

      const saveText = modified ? "Unsaved" : "Saved";
      return `${configName} - ${saveText}`;
    }
    return "";
  }

  @Mutation
  public setSnackbarDisplayed({ text, success }: {text: string, success: boolean}): void {
    this.snackbarDisplayed = false;
    this.snackbarText = text;
    this.snackbarSuccess = success;
    this.snackbarDisplayed = true;
  }

  @Mutation
  public hideSnackbar(): void {
    this.snackbarDisplayed = false;
  }

  @Mutation
  public fillAppInfos(appInfos: ApplicationInfo): void {
    this.appInfos = new ApplicationInfo(appInfos);
  }

  @Action
  public displaySnackbar(payload: {text: string, success: boolean}): void {
    this.context.commit("setSnackbarDisplayed", payload);
    setTimeout(() => {
      this.context.commit("hideSnackbar");
    }, 15000);
  }

  @Action
  public retrieveAppInfos(): Promise<void> {
    return ApplicationService.getVersionsInfo()
      .then((result) => {
        this.context.commit("fillAppInfos", result);
      });
  }

  @Action
  public retrieveChangelog(version: string): Promise<void> {
    return axios.get(`https://api.github.com/repos/vince-f/lemu/releases/tags/v${version}`)
      .then((response) => {
        return response.data.body;
      });
  }
}
