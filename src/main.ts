import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

import "./styles/font.css";
import "./styles/main.css";

declare global {
  interface Window {
    vueApp: any;
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

window.vueApp = new Vue({
  router,
  store,
  // @ts-ignore
  vuetify,
  render: (h) => h(App)
}).$mount('#app');
