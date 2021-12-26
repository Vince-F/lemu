import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";

@Module({
  namespaced: true
})
export default class SettingsStore extends VuexModule {
  public darkModeEnabled = false;
  public autoUpdate = true;
  public autoSave = -1;

  @Action({ rawError: true })
  public loadSettings(): Promise<void> {
    return new Promise((resolve, reject) => {
      const settingsStr = localStorage.getItem("settings");
      if (settingsStr) {
        try {
          const settings = JSON.parse(settingsStr);
          this.context.commit("setDarkMode", settings.darkMode ?? false);
          this.context.commit("setAutoUpdate", settings.autoUpdate ?? true);
          this.context.commit("setAutoSave", settings.autoSave ?? -1);
        } catch (e) {
          reject(e);
        }
      } else {
        resolve();
      }
    });
  }

  @Action({ rawError: true })
  public updateDarkMode(darkModeEnabled: boolean): Promise<void> {
    this.context.commit("setDarkMode", darkModeEnabled);
    return this.context.dispatch("saveSettings");
  }

  @Action({ rawError: true })
  public updateAutoUpdate(autoUpdateEnabled: boolean): Promise<void> {
    this.context.commit("setAutoUpdate", autoUpdateEnabled);
    return this.context.dispatch("saveSettings");
  }

  @Action({ rawError: true })
  public updateAutoSave(autoSaveTime: number): Promise<void> {
    this.context.commit("setAutoSave", autoSaveTime);
    return this.context.dispatch("saveSettings");
  }

  @Action({ rawError: true })
  public saveSettings(): void {
    localStorage.setItem("settings", JSON.stringify({
      darkMode: this.darkModeEnabled,
      autoUpdate: this.autoUpdate,
      autoSave: this.autoSave
    }));
  }

  @Mutation
  public setDarkMode(enabled: boolean): void {
    this.darkModeEnabled = enabled;
  }

  @Mutation
  public setAutoUpdate(enabled: boolean): void {
    this.autoUpdate = enabled;
  }

  @Mutation
  public setAutoSave(autoSaveTime: number): void {
    this.autoSave = autoSaveTime;
  }
}
