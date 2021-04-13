<template>
  <v-container
    class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-card class="elevation-8">
        <v-card-title>Welcome to LEMU!</v-card-title>
        <v-card-text class="open-file-starter">
          <div class="open-section">
            <h1 class="v-card__title no-left-padding">Manage your configuration</h1>
            <p>
              To start open a BackstopJS tests configuration file ("backstop.json")
            </p>
            <p>
              <v-btn large color="primary" v-on:click="openSearchFileModal">
                Open backstop.json file...
              </v-btn>
            </p>
            <p>
              <v-btn large color="primary" @click="createNewConfig">
                Create new config...
              </v-btn>
            </p>
          </div>
          <div class="open-recent-section">
            <h1 class="v-card__title no-left-padding">Recently opened</h1>
            <p v-if="recentlyOpened.length === 0">
              No config opened recently.
            </p>
            <p v-for="path in recentlyOpened" :key="path">
              <a href="#" @click="openSpecificConfig(path)">{{path}}</a>
            </p>
          </div>
          <div class="template-section">
            <h1 class="v-card__title no-left-padding">Manage your templates</h1>
            <p>
              Manage your templates to ease reuse accross projects.
            </p>
            <v-btn large color="primary" @click="goToTemplates">
              Manage templates
            </v-btn>
          </div>
          <div class="general-section">
            <h1 class="v-card__title no-left-padding">Help</h1>
            <p>
              <a href="#" @click="openUserGuide">Open user guide...</a>
            </p>
            <p>
              <a href="#" @click="openVersionChangelog">Open version changelog...</a>
            </p>
          </div>
        </v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>

<style scoped>
.open-file-starter {
  display: grid;
}

.open-section {
  grid-column: 1;
  grid-row: 1;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  padding: 16px;
}

.open-recent-section {
  grid-column: 1;
  grid-row: 2;
  padding: 16px;
  width: 30rem;
}

.template-section {
  grid-column: 2;
  grid-row: 1;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  padding: 16px;
}

.general-section {
  grid-column: 2;
  grid-row: 2;
  padding: 16px;
}

.no-left-padding {
  padding-left: 0;
}
</style>

<script lang="ts">
import { BackstopConfiguration } from "@/models/backstopConfiguration";
import { ModalService } from "@/services/modalService";
import { Vue, Component } from "vue-property-decorator";
import { Action } from "vuex-class";
import NewConfigModalComponent from "./NewConfigModalComponent.vue";
import ReleaseInfoModalComponent from "../app/ReleaseInfoModalComponent.vue";

@Component({
  name: "open-configuration-component"
})
export default class OpenConfigurationComponent extends Vue {
  @Action("configurationStore/openConfiguration")
  private readonly openConfiguration!: () => Promise<void>;

  @Action("configurationStore/openConfigurationFromPath")
  private readonly openConfigurationFromPath!: (path: string) => Promise<void>;

  @Action("configurationStore/initConfig")
  private readonly initTests!: (payload: {template: BackstopConfiguration, directory: string}) => Promise<void>;

  @Action("applicationStore/displaySnackbar")
  private readonly displaySnackbar!: (payload: {text: string, success: boolean}) => void;

  private recentlyOpened: string[];

  constructor() {
    super(arguments);
    this.recentlyOpened = [];
  }

  private created() {
    try {
      this.recentlyOpened = JSON.parse(localStorage.getItem("recentlyOpened") || "");
    } catch (e) {
      window.ipcHandler.logger.warn("fail to open recent path");
    }
  }

  private createNewConfig() {
    ModalService.launchModal(NewConfigModalComponent)
      .then((payload: {template: BackstopConfiguration, directory: string}) => {
        this.initTests(payload)
          .then(() => {
            this.$router.push({ name: "generalConfiguration" });
          }).catch((error) => {
            if (!(error instanceof Error) || !error.message.endsWith("dismiss")) {
              this.displaySnackbar({ text: "Failed to open file. " + error, success: false });
            }
          });
      });
  }

  private goToTemplates() {
    this.$router.push({ name: "scriptTemplates.welcome" });
  }

  private openSearchFileModal() {
    this.openConfiguration()
      .then(() => {
        this.$router.push({ name: "generalConfiguration" });
      }).catch((error) => {
        if (!(error instanceof Error) || !error.message.endsWith("dismiss")) {
          this.displaySnackbar({ text: "Failed to open file. " + error, success: false });
        }
      });
  }

  private openSpecificConfig(path: string) {
    this.openConfigurationFromPath(path)
      .then(() => {
        this.$router.push({ name: "generalConfiguration" });
      }).catch((error) => {
        if (!(error instanceof Error) || !error.message.endsWith("dismiss")) {
          this.displaySnackbar({ text: "Failed to open file. " + error, success: false });
        }
      });
  }

  private openUserGuide() {
    window.ipcHandler.send("helpWindow");
  }

  private openVersionChangelog() {
    ModalService.launchModal(ReleaseInfoModalComponent);
  }
}
</script>
