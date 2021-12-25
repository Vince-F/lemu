<template>
  <v-app class="app">
    <app-toolbar-component class="sub-toolbar"></app-toolbar-component>
    <v-main>
      <div class="content-container">
        <router-view />
      </div>
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
      <v-btn color="white" text @click="hideSnackbar">
        Close
      </v-btn>
    </v-snackbar>

    <v-snackbar :value="updateSnackbarDisplayed" right bottom timeout="-1">
      <v-icon color="blue">
        mdi-update
      </v-icon>
      {{ updateMessage }}
      <v-spacer />
      <v-btn color="white" text @click="restartAndInstall" v-if="updateDownloaded">
        Restart and install
      </v-btn>
      <v-btn color="white" text @click="download" v-else>
        Download
      </v-btn>
      <v-btn color="white" text @click="hideUpdateSnackbar">
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

  .content-container {
    height: 100%;
    overflow: auto;
  }
</style>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { Action, Mutation, State } from "vuex-class";
import AppToolbarComponent from "./components/app/AppToolbarComponent.vue";
import { ModalService } from "./services/modalService";
import ReleaseInfoModalComponent from "./components/app/ReleaseInfoModalComponent.vue";
import { eventNames } from "../shared/constants/eventNames";
import { BackstopConfiguration } from "./models/backstopConfiguration";

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

  @State((state) => state.settingsStore.darkModeEnabled)
  private readonly darkModeEnabled!: boolean;

  @State((state) => state.settingsStore.autoSave)
  private readonly autoSave!: number;

  @State((state) => state.configurationStore.currentConfiguration)
  private readonly configuration!: BackstopConfiguration | null;

  private autoSaveToken: number | null;

  @Mutation("applicationStore/hideSnackbar")
  private readonly hideSnackbar!: () => void;

  @Action("applicationStore/retrieveAppInfos")
  private readonly retrieveAppInfos!: () => Promise<void>;

  @Action("testLogStore/initializeLogListener")
  private readonly initializeLogListener!: () => Promise<void>;

  @Action("settingsStore/loadSettings")
  private readonly loadSettings!: () => Promise<void>;

  @Action("configurationStore/saveConfiguration")
  private readonly saveConfiguration!: () => Promise<void>;

  private updateSnackbarDisplayed: boolean;
  private updateMessage: string;
  private updateDownloaded: boolean;

  constructor() {
    super(arguments);
    this.updateSnackbarDisplayed = false;
    this.updateMessage = "";
    this.updateDownloaded = false;
    this.autoSaveToken = null;
  }

  private mounted() {
    window.ipcHandler.createTitleBar();
    this.initializeLogListener();
    this.loadSettings();
    this.retrieveAppInfos()
      .then(() => {
        if (this.appInfos) {
          if (!localStorage[`changelog_${this.appInfos.appVersion}_displayed`]) {
            ModalService.launchModal(ReleaseInfoModalComponent);
            localStorage.setItem(`changelog_${this.appInfos.appVersion}_displayed`, "true");
          }
        }
      });

    window.ipcHandler.receiveOnce(eventNames.UPDATE_AVAILABLE, () => {
      this.updateMessage = "An update is available";
      this.updateSnackbarDisplayed = true;
      this.updateDownloaded = false;
    });
    window.ipcHandler.receiveOnce(eventNames.UPDATE_DOWNLOADED, () => {
      this.updateMessage = "An update has been downloaded";
      this.updateSnackbarDisplayed = true;
      this.updateDownloaded = true;
    });
  }

  private download() {
    window.ipcHandler.send(eventNames.DOWNLOAD_UPDATE);
  }

  private restartAndInstall() {
    window.ipcHandler.send(eventNames.INSTALL_AND_RESTART);
  }

  private hideUpdateSnackbar() {
    this.updateSnackbarDisplayed = false;
  }

  @Watch("darkModeEnabled", { immediate: true })
  private updateDarkMode() {
    this.$vuetify.theme.dark = this.darkModeEnabled;
  }

  @Watch("autoSave")
  private updateAutoSave() {
    if (this.autoSaveToken !== null) {
      window.clearInterval(this.autoSaveToken);
    }
    if (this.autoSave > 0) {
      this.autoSaveToken = window.setInterval(() => {
        if (this.configuration) {
          this.saveConfiguration();
        }
      }, this.autoSave * 60 * 1000);
    }
  }
}
</script>
