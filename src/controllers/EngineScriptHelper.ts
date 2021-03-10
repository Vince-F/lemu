import { EngineScript } from "@/models/engineScript";

export class EngineScriptHelper {
  public static getScriptsName(scripts: EngineScript[], engineScriptDirectory: string): string[] {
    let scriptDirectory = engineScriptDirectory.replace(/\\/g, "/");
    if (!scriptDirectory.endsWith("/")) {
      scriptDirectory += "/";
    }
    return scripts.map((script) => {
      return script.path.replace(scriptDirectory, "");
    });
  }
}
