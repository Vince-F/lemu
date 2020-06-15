import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import { CustomScript } from '@/models/customScript';
import { BackstopService } from '@/services/backstopService';
import { FileService } from "../services/fileService";

@Module({
  namespaced: true
})
export default class CustomScriptStore extends VuexModule {
  private scripts: CustomScript[] = [];
  private removedScriptsPath: string[] = [];
  private scriptsModified: boolean = false;

  public get getScript() {
    const scripts = this.scripts;
    return (path: string) => {
      path = path.replace(/\\/g, "/");
      return scripts.filter((entry) => entry.path.replace(/\\/g, "/").endsWith(path))[0];
    };
  }

  @Mutation
  public addScript({scriptPath, content}: {scriptPath: string, content: string}) {
    const newScript = new CustomScript(scriptPath, content);
    this.scripts.push(newScript);
    this.scriptsModified = true;
  }

  @Mutation
  public removeScript(scriptPath: string) {
    const idx = this.scripts.findIndex((entry) => entry.path === scriptPath);
    if (idx > -1) {
      this.scripts.splice(idx, 1);
      this.removedScriptsPath.push(scriptPath);
      this.scriptsModified = true;
    }
  }

  @Mutation
  public setCustomScripts(customScripts: CustomScript[]) {
    this.scripts = customScripts;
  }

  @Mutation
  public setScriptContent({path, content}: {path: string, content: string}) {
    this.scripts.forEach((script) => {
      if (script.path === path) {
        script.content = content;
      }
    })
  }

  @Action({rawError: true})
  public retrieveCustomScripts() {
    const engineScriptPath = this.context.rootGetters["configurationStore/engineScriptDirectory"];

    return BackstopService.retrieveCustomScripts(engineScriptPath)
      .then((files) => {
        this.context.commit("setCustomScripts", files);
      });
  }

  @Action
  public saveAllScripts() {
    return Promise.all(this.scripts.map((script) => {
      return FileService.writeFile(script.path, script.content);
    }));
  }
}
