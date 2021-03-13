<template>
  <v-app class="app">
    <app-toolbar-component class="sub-toolbar"></app-toolbar-component>
    <v-main>
      <router-view />
    </v-main>

    <v-snackbar :value="snackbarDisplayed" left top>
      <v-icon color="green" v-if="snackbarSuccess">
        mdi-check-circle
      </v-icon>
      <v-icon color="red" v-else>
        mdi-alert
      </v-icon>
      {{ snackbarText }}
      <v-spacer />
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
  .sub-toolbar {
    top: 30px;
  }
  
  .app-title {
    font-weight: 400;
  }
  
  .app {
    position: absolute;
    inset: 0;
  }

  .app >>> .v-application--wrap {
    min-height: calc(100vh - 30px);
  }
</style>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Action, Mutation, State } from "vuex-class";
import AppToolbarComponent from "./components/app/AppToolbarComponent.vue";
import { ModalService } from "./services/modalService";
import ReleaseInfoModalComponent from "./components/app/ReleaseInfoModalComponent.vue";

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
  @State((state) => state.applicationStore.appInfos)
  private readonly appInfos!: {appVersion: string, backstopVersion: string} | null;
  @Mutation("applicationStore/hideSnackbar")
  private readonly hideSnackbar!: () => void;
  @Action("applicationStore/retrieveAppInfos")
  private readonly retrieveAppInfos!: () => Promise<void>;
  @Action("testLogStore/initializeLogListener")
  private readonly initializeLogListener!: () => Promise<void>;


  private mounted() {
    window.ipcHandler.createTitleBar();
    this.initializeLogListener();
    this.retrieveAppInfos()
      .then(() => {
        if (this.appInfos) {
          if (!localStorage[`changelog_${this.appInfos.appVersion}_displayed`]) {
            ModalService.launchModal(ReleaseInfoModalComponent);
            localStorage.setItem(`changelog_${this.appInfos.appVersion}_displayed`, "true");
          }
        }
      });
  }
}
</script>
