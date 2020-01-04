

export default {
  namespaced: true,
  state: {
    snackbarText: "" as string,
    snackbarDisplayed: false as boolean,
    snackbarSuccess: false as boolean
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
    }
  }
}

