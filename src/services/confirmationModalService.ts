import ConfirmationModalComponent from "../components/modals/ConfirmationModalComponent.vue";

export class ConfirmationModalService {
  public static launchConfirmationModal() {
    return new Promise((resolve, reject) => {
      let element = document.getElementById("#modal");
      if (!element) {
        element = document.createElement('div');
        element.id = "modal";
        document.getElementById("#app")
        document.body.appendChild(element);
      }

      const modal = new ConfirmationModalComponent({
        parent: window.vueApp
      });

      modal.$on('accept', () => {
        resolve();
      });
      modal.$on('dimiss', () => {
        modal.$destroy();
        reject();
      });

      modal.$mount(element);
    });
  }
}
