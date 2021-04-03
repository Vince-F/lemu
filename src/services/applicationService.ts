import { eventNames } from "../../shared/constants/eventNames";

export class ApplicationService {
  public static getVersionsInfo(): Promise<{ appVersion: string, backstopVersion: string}> {
    return window.ipcHandler.invoke(eventNames.APP_INFOS);
  }
}
