import { VuexModule, Module, Mutation, Action } from "vuex-module-decorators";
import { EngineScript } from "@/models/engineScript";
import { BackstopService } from "@/services/backstopService";
import { FileService } from "../services/fileService";

@Module({
  namespaced: true
})
export default class EngineScriptStore extends VuexModule {
  private scripts: EngineScript[] = [];
  private removedScriptsPath: string[] = [];
  private scriptsModified = false;

  public get getScript(): (path: string) => EngineScript | undefined {
    const scripts = this.scripts;
    return (path: string) => {
      path = path.replace(/\\/g, "/");
      return scripts.find((entry) => entry.path.replace(/\\/g, "/").endsWith(path));
    };
  }

  @Mutation
  public addScript({ scriptPath, content }: {scriptPath: string, content: string}): void {
    scriptPath = scriptPath.replaceAll("\\", "/");
    const newScript = new EngineScript(scriptPath, content);
    this.scripts.push(newScript);
    this.scriptsModified = true;
  }

  @Mutation
  public cleanAfterSave(): void {
    this.scriptsModified = false;
    this.removedScriptsPath = [];
  }

  @Mutation
  public removeScript(scriptPath: string): void {
    const idx = this.scripts.findIndex((entry) => entry.path.replace(/\\/g, "/").endsWith(scriptPath));
    if (idx > -1) {
      const path = this.scripts[idx].path;
      this.scripts.splice(idx, 1);
      this.removedScriptsPath.push(path);
      this.scriptsModified = true;
    }
  }

  @Mutation
  public setEngineScripts(engineScripts: EngineScript[]): void {
    this.scripts = engineScripts.map((entry) => {
      entry.path = entry.path.replace(/\\/g, "/");
      return entry;
    });
    this.scriptsModified = true;
  }

  @Mutation
  public setScriptContent({ path, content }: {path: string, content: string}): void {
    this.scripts.forEach((script) => {
      if (script.path === path) {
        script.content = content;
      }
    });
  }

  @Action({ rawError: true })
  public addActionsScript(): void {
    const scriptContent =
`
module.exports = async (page, scenario, vp) => {
  await require('./onReady')(page, scenario, vp);

  const actions = scenario.actions;

  if (Array.isArray(actions)) {
    for (let i = 0; i < actions.length; i++) {
      const { type, selector, key, text, delay,
        coordinate } = actions[i];
      switch (type) {
        case 'click':
          await page.waitForSelector(selector);
          await page.click(selector);
          break;
        case 'focus':
          await page.waitForSelector(selector);
          await page.focus(selector);
          break;
        case 'hover':
          await page.waitForSelector(selector);
          await page.hover(selector);
          break;
        case 'waitForTimeout':
          await page.waitForTimeout(delay);
          break;
        case 'waitForSelector':
          await page.waitForSelector(selector);
          break;
        case 'pressKey':
          await page.keyboard.press(key);
          break;
        case 'type':
          await page.keyboard.type(text);
          break;
        case 'mouseMove':
          await page.mouse.move(coordinate.x, coordinate.y);
          break;
      }
    }
  }
};
`;
    const scriptPath = this.context.rootGetters["configurationStore/engineScriptDirectory"];
    const path = FileService.resolvePath([scriptPath, "actions.js"]);
    this.context.commit("addScript", { scriptPath: path, content: scriptContent });
  }

  @Action({ rawError: true })
  public retrieveEngineScripts(): Promise<void> {
    const engineScriptPath = this.context.rootGetters["configurationStore/engineScriptDirectory"];

    return BackstopService.retrieveEngineScripts(engineScriptPath)
      .then((files) => {
        this.context.commit("setEngineScripts", files);
      });
  }

  @Action({ rawError: true })
  public saveAllScripts(): Promise<void> {
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
