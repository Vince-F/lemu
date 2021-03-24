import Vue from 'vue';
// @ts-ignore it makes TS fail because typings are a root, but it seems to be the only to have correct css
import Vuetify from 'vuetify/lib';

declare module "vue/types/vue" {
  interface Vue {
    $vuetify: any;
  }
}

Vue.use(Vuetify);

export default new Vuetify({
  theme: { dark: false }
});
