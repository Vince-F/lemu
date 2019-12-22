import ConfirmationModalComponent from "../components/modals/ConfirmationModalComponent.vue";
import SaveConfirmationModalComponent from "../components/modals/SaveConfirmationModalComponent.vue";

export class ConfirmationModalService {
  public static launchConfirmationModal(): Promise<void> {
    return new Promise((resolve, reject) => {
      const element = this.getModalContainerElement();
      const modal = new ConfirmationModalComponent({
        parent: window.vueApp
      });

      modal.$on('accept', () => {
        modal.$destroy();
        resolve();
      });
      modal.$on('dimiss', () => {
        modal.$destroy();
        reject();
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

      modal.$on('save', () => {
        modal.$destroy();
        resolve("save");
      });
      modal.$on('discard', () => {
        modal.$destroy();
        resolve("discard");
      });
      modal.$on('dimiss', () => {
        modal.$destroy();
        reject();
      });

      modal.$mount(element);
    });
  }

  private static getModalContainerElement() {
    let element = document.getElementById("#modal");
    if (!element) {
      element = document.createElement('div');
      element.id = "modal";
      document.getElementById("#app");
      document.body.appendChild(element);
    }
    return element;
  }
}
