import { ApplicationService } from '@/services/applicationService';
import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';

@Module({
  namespaced: true
})
export default class ApplicationStore extends VuexModule {
  public snackbarText: string = "";
  public snackbarDisplayed: boolean = false;
  public snackbarSuccess: boolean = false;
  public appInfos: {
    appVersion: string,
    backstopVersion: string
  } | null = null;

  @Mutation
  public displaySnackbar({text, success}: {text: string, success: boolean}) {
    this.snackbarDisplayed = false;
    this.snackbarText = text;
    this.snackbarSuccess = success;
    this.snackbarDisplayed = true;
  }

  @Mutation
  public hideSnackbar() {
    this.snackbarDisplayed = false;
  }

  @Mutation
  public fillAppInfos(appInfos: any) {
    this.appInfos = appInfos;
  }

  @Action
  public retrieveAppInfos() {
    return ApplicationService.getVersionsInfo()
        .then((result) => {
          this.context.commit("fillAppInfos", result);
        });
  }
}
