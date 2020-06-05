import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import { CustomScript } from '@/models/customScript';
import { BackstopService } from '@/services/backstopService';

@Module({
  namespaced: true
})
export default class CustomScriptStore extends VuexModule {
  public scripts: CustomScript[] = [];

  public get getScript() {
    const scripts = this.scripts;
    return (path: string) => {
      return scripts.filter((entry) => entry.path.endsWith(path))[0];
    }
  }

  @Mutation
  public setCustomScripts(customScripts: CustomScript[]) {
    this.scripts = customScripts;
  }

  @Action({rawError: true})
  public retrieveCustomScripts() {
    const engineScriptPath = this.context.rootGetters["configurationStore/engineScriptDirectory"];

    return BackstopService.retrieveCustomScripts(engineScriptPath)
      .then((files) => {
        this.context.commit("setCustomScripts", files);
      });
  }
}
