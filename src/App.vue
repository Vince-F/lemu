<template>
  <v-app>
    <app-toolbar-component></app-toolbar-component>
    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<style scoped>
  .app-title {
    font-weight: 400;
  }
</style>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import {Action} from "vuex-class";
import AppToolbarComponent from "./components/AppToolbarComponent.vue";

@Component({
  components: {
    AppToolbarComponent
  }
})
export default class App extends Vue {
}
</script>
