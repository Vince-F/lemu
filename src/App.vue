<template>
  <v-app>
    <app-toolbar-component></app-toolbar-component>
    <v-content>
      <router-view />
    </v-content>

    <v-snackbar :value="snackbarDisplayed" top :timeout=0>
      <v-icon color="green" v-if="snackbarSuccess">
        mdi-check-circle
      </v-icon>
      <v-icon color="red" v-else>
        mdi-alert
      </v-icon>
      {{ snackbarText }}
      <v-btn
        color="white"
        text
        @click="hideSnackbar"
      >
        Close
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<style scoped>
  .app-title {
    font-weight: 400;
  }
</style>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import {Action, Mutation, State} from "vuex-class";
import AppToolbarComponent from "./components/AppToolbarComponent.vue";
import { SnackbarService } from "./services/snackbarService";

@Component({
  components: {
    AppToolbarComponent
  }
})
export default class App extends Vue {
  @State((state) => state.applicationStore.snackbarDisplayed)
  private readonly snackbarDisplayed!: boolean;
  @State((state) => state.applicationStore.snackbarText)
  private readonly snackbarText!: string;
  @State((state) => state.applicationStore.snackbarSuccess)
  private readonly snackbarSuccess!: boolean;
  @Mutation("applicationStore/hideSnackbar")
  private readonly hideSnackbar!: () => void;
}
</script>
