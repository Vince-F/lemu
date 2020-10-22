import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators';
import { EngineScript } from '@/models/engineScript';
import { BackstopService } from '@/services/backstopService';
import { FileService } from "../services/fileService";

@Module({
  namespaced: true
})
export default class EngineScriptStore extends VuexModule {
  private scripts: EngineScript[] = [];
  private removedScriptsPath: string[] = [];
  private scriptsModified: boolean = false;

  public get getScript() {
    const scripts = this.scripts;
    return (path: string) => {
      path = path.replace(/\\/g, "/");
      return scripts.find((entry) => entry.path.replace(/\\/g, "/").endsWith(path));
    };
  }

  @Mutation
  public addScript({scriptPath, content}: {scriptPath: string, content: string}) {
    const newScript = new EngineScript(scriptPath, content);
    this.scripts.push(newScript);
    this.scriptsModified = true;
  }

  @Mutation
  public cleanAfterSave() {
    this.scriptsModified = false;
    this.removedScriptsPath = [];
  }

  @Mutation
  public removeScript(scriptPath: string) {
    const idx = this.scripts.findIndex((entry) => entry.path.replace(/\\/g, "/").endsWith(scriptPath));
    if (idx > -1) {
      const path = this.scripts[idx].path;
      this.scripts.splice(idx, 1);
      this.removedScriptsPath.push(path);
      this.scriptsModified = true;
    }
  }

  @Mutation
  public setEngineScripts(engineScripts: EngineScript[]) {
    this.scripts = engineScripts.map((entry) => {
      entry.path = entry.path.replace(/\\/g, "/");
      return entry;
    });
    this.scriptsModified = true;
  }

  @Mutation
  public setScriptContent({path, content}: {path: string, content: string}) {
    this.scripts.forEach((script) => {
      if (script.path === path) {
        script.content = content;
      }
    });
  }

  @Action({rawError: true})
  public retrieveEngineScripts() {
    const engineScriptPath = this.context.rootGetters["configurationStore/engineScriptDirectory"];

    return BackstopService.retrieveEngineScripts(engineScriptPath)
      .then((files) => {
        this.context.commit("setEngineScripts", files);
      });
  }

  @Action({rawError: true})
  public saveAllScripts() {
    const savePromises = this.scripts.map((script) => {
      return FileService.writeFile(script.path, script.content);
    });
    const deletePromises = this.removedScriptsPath.map((path) => {
      return FileService.deleteFile(path);
    });
    return Promise.all([...savePromises, ...deletePromises])
      .then(() => {
        this.context.commit("cleanAfterSave");
      });
  }
}
