
import "@mdi/font/css/materialdesignicons.min.css";
import Vue from "vue";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore it makes TS fail because typings are a root, but it seems to be the only to have correct css
import Vuetify from "vuetify/lib";

declare module "vue/types/vue" {
  interface Vue {
    $vuetify: any; // eslint-disable-line
  }
}

Vue.use(Vuetify);

export default new Vuetify({
  theme: { dark: false }
});
