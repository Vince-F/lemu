import ConfirmationModalComponent from "../components/app/ConfirmationModalComponent.vue";
import SaveConfirmationModalComponent from "../components/app/SaveConfirmationModalComponent.vue";
import { VueConstructor } from "vue";

export class ModalService {
  // the consumers redefine the type of return because it is context specific
  // but I don't know how to handle that properly
  public static launchModal(ModalComponent: VueConstructor, payload?: unknown)
    : Promise<any> { // eslint-disable-line
    return new Promise((resolve, reject) => {
      const element = this.getModalContainerElement();
      const modal = new ModalComponent({
        parent: window.vueApp,
        propsData: {
          payload
        }
      });

      modal.$on("validate", (resultPayload: unknown) => {
        modal.$destroy();
        resolve(resultPayload);
      });
      modal.$on("dimiss", () => {
        modal.$destroy();
        reject(new Error());
      });

      modal.$mount(element);
    });
  }

  public static launchConfirmationModal(textContent: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const element = this.getModalContainerElement();
      const modal = new ConfirmationModalComponent({
        parent: window.vueApp,
        propsData: {
          textContent
        }
      });

      modal.$on("accept", () => {
        modal.$destroy();
        resolve();
      });
      modal.$on("dimiss", () => {
        modal.$destroy();
        reject(new Error());
      });

      modal.$mount(element);
    });
  }

  public static launchSaveConfirmationModal(): Promise<string> {
    return new Promise((resolve, reject) => {
      const element = this.getModalContainerElement();
      const modal = new SaveConfirmationModalComponent({
        parent: window.vueApp
      });

      modal.$on("save", () => {
        modal.$destroy();
        resolve("save");
      });
      modal.$on("discard", () => {
        modal.$destroy();
        resolve("discard");
      });
      modal.$on("dimiss", () => {
        modal.$destroy();
        reject(new Error());
      });

      modal.$mount(element);
    });
  }

  private static getModalContainerElement(): HTMLElement {
    let element = document.getElementById("#modal");
    if (!element) {
      element = document.createElement("div");
      element.id = "modal";
      document.getElementById("#app");
      document.body.appendChild(element);
    }
    return element;
  }
}
