import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";

import "./styles/font.css";
import "./styles/main.css";

Vue.config.productionTip = false;

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    vueApp: Vue;
    ipcHandler: {
      send: (channel: string, ...args: any[]) => void;
      sendSync: (channel: string, ...args: any[]) => any;
      receive: (channel: string, callback: (...args: any[]) => void) => void;
      receiveOnce: (channel: string, callback: (...args: any[]) => void) => void;
      invoke: (channel: string, ...args: any[]) => Promise<any>;
      createTitleBar: () => void;
      updateTitleBarTitle: (newTitle: string) => void;
      logger: {
        silly(...args: string[]): void;
        info(...args: string[]): void;
        warn(...args: string[]): void;
        error(...args: string[]): void;
      };
    };
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

window.vueApp = new Vue({
  router,
  store,
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  vuetify,
  render: (h) => h(App)
}).$mount("#app");
