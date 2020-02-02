import { ApplicationService } from '@/services/applicationService';


export default {
  namespaced: true,
  state: {
    snackbarText: "",
    snackbarDisplayed: false,
    snackbarSuccess: false,
    appInfos: null as {
      appVersion: string,
      backstopVersion: string
    } | null
  },
  mutations: {
    displaySnackbar(state: any, {text, success}: {text: string, success:boolean}) {
      state.snackbarDisplayed = false;
      state.snackbarText = text;
      state.snackbarSuccess = success;
      state.snackbarDisplayed = true;
    },

    hideSnackbar(state: any) {
      state.snackbarDisplayed = false;
    },

    fillAppInfos(state: any, appInfos: any) {
      state.appInfos = appInfos;
    }
  },
  actions: {
    retrieveAppInfos({commit}: any) {
      return ApplicationService.getVersionsInfo()
        .then((result) => {
          commit("fillAppInfos", result);
        });
    }
  }
};

