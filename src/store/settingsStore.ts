import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';


@Module({
  namespaced: true
})
export default class SettingsStore extends VuexModule {
  public darkModeEnabled: boolean = false;

  @Action({ rawError: true })
  public loadSettings(): Promise<void> {
    return new Promise((resolve, reject) => {
      const settingsStr = localStorage.getItem("settings");
      if (settingsStr) {
        try {
          const settings = JSON.parse(settingsStr);
          this.context.commit("setDarkMode", settings.darkMode ?? false);
        } catch (e) {
          reject(e);
        }
      } else {
        resolve();
      }
    });
  }

  @Action({ rawError: true })
  public updateDarkMode(darkModeEnabled: boolean) {
    this.context.commit("setDarkMode", darkModeEnabled);
    return this.context.dispatch("saveSettings");
  }

  @Action({ rawError: true })
  public saveSettings() {
    localStorage.setItem("settings", JSON.stringify({
      darkMode: this.darkModeEnabled
    }));
  }

  @Mutation
  public setDarkMode(enabled: boolean) {
    this.darkModeEnabled = enabled;
  }
}
