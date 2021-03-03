import { eventNames } from "../../shared/constants/eventNames";

export class ApplicationService {
  public static getVersionsInfo() {
    return window.ipcHandler.invoke(eventNames.APP_INFOS);
  }
}
