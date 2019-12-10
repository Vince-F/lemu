import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false;

import "./styles/font.css";
import "@mdi/font/css/materialdesignicons.min.css";
import "./styles/main.css";


new Vue({
  router,
  store,
  // @ts-ignore
  vuetify,
  render: (h) => h(App)
}).$mount('#app');
