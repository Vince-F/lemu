<template>
  <v-app-bar app color="primary" dark>
    <div class="d-flex align-center flex-grow-1 flex-shrink-1">
      <v-img
        alt="Lemu Logo"
        class="shrink mr-2"
        contain
        src="../../assets/icon.png"
        transition="scale-transition"
        width="40"
      />
      <template v-if="applicationTitle">
        {{applicationTitle}}
      </template>
      <template v-else>
        LEMU
      </template>
    </div>

    <div class="flex-grow-0 flex-shrink-0">
      <div class="search-container" v-if="hasConfiguration">
        <v-autocomplete
          v-model="selectedTest"
          :items="foundTests"
          @update:search-input="updateTestSearchInput"
          @change="goToTest"
          label="Search in tests"
        ></v-autocomplete>
      </div>
    </div>

    <div class="flex-grow-1 flex-shrink-1 button-container">
      <v-btn
        text
        v-on:click="runTests"
        v-if="hasConfiguration"
        :disabled="testRunning"
      >
        <template v-if="!testRunning">
          <v-icon>mdi-play</v-icon>
          Run tests
        </template>
        <template v-else>
          <v-progress-circular indeterminate color="white"></v-progress-circular>
          Tests running
        </template>
      </v-btn>

      <v-btn text v-on:click="openConfig">
        <v-icon>mdi-folder-open</v-icon>
        Open...
      </v-btn>

      <v-btn text v-on:click="save" v-if="hasConfiguration || isInTemplate">
        <v-icon>mdi-content-save</v-icon>
        Save
      </v-btn>
      <v-btn text v-on:click="close" v-if="hasConfiguration || isInTemplate">
        <v-icon>mdi-exit-to-app</v-icon>
        Close
      </v-btn>
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn text v-bind="attrs" v-on="on">
            <v-icon>mdi-dots-vertical</v-icon>
            More
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="displayAbout">
            <v-list-item-icon>
              <v-icon>mdi-information</v-icon>
            </v-list-item-icon>
            <v-list-item-title>About</v-list-item-title>
          </v-list-item>
          <v-list-item @click="displayHelp">
            <v-list-item-icon>
              <v-icon>mdi-help</v-icon>
            </v-list-item-icon>
            <v-list-item-title>Help</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-app-bar>
</template>

<style scoped>
.search-container {
  margin-top: 24px;
  width: 18rem;
  padding: 0 2rem;
}

.v-btn .v-icon {
  margin-right: 8px;
}

.button-container {
  text-align: right;
}
</style>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { Action, Mutation, Getter, State } from "vuex-class";
import { ModalService } from "../../services/modalService";
import AboutModalComponent from "./AboutModalComponent.vue";
import { SearchService } from "../../services/searchService";

@Component({})
export default class AppToolbarComponent extends Vue {
  @Action("configurationStore/saveConfiguration")
  private readonly saveConfiguration!: () => Promise<void>;
  @Mutation("configurationStore/dismissCurrentConfiguration")
  private readonly dismissCurrentConfiguration!: () => void;
  @Getter("configurationStore/hasConfiguration")
  private readonly hasConfiguration!: boolean;
  @Getter("configurationStore/hasConfigurationBeenModified")
  private readonly hasConfigurationBeenModified!: boolean;
  @State((state) => state.testRunnerStore.testRunning)
  private readonly testRunning!: boolean;
  @Action("testRunnerStore/runTests")
  private readonly runBackstopTests!: () => Promise<any>;
  @Action("applicationStore/displaySnackbar")
  private readonly displaySnackbar!: (payload: {
    text: string;
    success: boolean;
  }) => void;
  @Action("engineScriptStore/saveAllScripts")
  private readonly saveAllScripts!: () => Promise<void>;
  @Action("configurationStore/openConfiguration")
  private openConfiguration!: () => Promise<any>;
  @Action("templateStore/saveTemplates")
  private saveTemplates!: () => Promise<void>;
  @Getter("applicationStore/applicationTitle")
  private readonly applicationTitle!: string;

  private selectedTest: number | null;
  private foundTests: any[];

  constructor() {
    super(arguments);
    this.selectedTest = null;
    this.foundTests = [];
  }

  private get isInTemplate() {
    return this.$route.path.startsWith("/template");
  }

  private close() {
    if (this.hasConfigurationBeenModified) {
      ModalService.launchSaveConfirmationModal().then((action) => {
        switch (action) {
          case "discard":
            this.dismissAndGoToStartScreen();
            break;
          case "save":
            this.save().then(() => {
              this.dismissAndGoToStartScreen();
            });
            break;
        }
      });
    } else {
      this.dismissAndGoToStartScreen();
    }
  }

  private dismissAndGoToStartScreen() {
    this.dismissCurrentConfiguration();
    this.$router.push("/");
  }

  private displayAbout() {
    ModalService.launchModal(AboutModalComponent);
  }

  private displayHelp() {
    window.ipcHandler.send("helpWindow");
  }

  private goToTest() {
    this.$router.push(`/tests/list/test/${this.selectedTest}`);
  }

  private openConfig() {
    if (this.hasConfigurationBeenModified) {
      ModalService.launchSaveConfirmationModal().then((action) => {
        switch (action) {
          case "discard":
            this.openConfigAndGoToTestView();
            break;
          case "save":
            this.save().then(() => {
              this.openConfigAndGoToTestView();
            });
            break;
        }
      });
    } else {
      this.openConfigAndGoToTestView();
    }
  }

  private openConfigAndGoToTestView() {
    this.openConfiguration()
      .then((fileContent) => {
        this.$router.push("/tests/generalConfig");
      })
      .catch((error) => {
        if (!(error instanceof Error) || !error.message.endsWith("dismiss")) {
          this.displaySnackbar({
            text: "Failed to open file. " + error,
            success: false,
          });
        }
      });
  }

  private runTests() {
    this.runBackstopTests()
      .then((result) => {
        this.displaySnackbar({ text: "Tests successful", success: true });
      })
      .catch((error) => {
        this.displaySnackbar({
          text: "Tests failed. Open the logs to see more details.",
          success: false,
        });
      });
  }

  private save() {
    let savePromises: Array<Promise<void>> = [];
    if (this.isInTemplate) {
      savePromises = [this.saveTemplates()];
    } else {
      savePromises = [this.saveConfiguration(), this.saveAllScripts()];
    }
    return Promise.all(savePromises)
      .then(() => {
        this.displaySnackbar({ text: "File saved", success: true });
      })
      .catch((error) => {
        this.displaySnackbar({
          text: "Failed to save file: " + error,
          success: false,
        });
      });
  }

  @Watch("applicationTitle")
  private updateTitle() {
    window.ipcHandler.updateTitleBarTitle(this.applicationTitle);
  }

  private updateTestSearchInput(searchTerm: string) {
    if (searchTerm) {
      this.foundTests = SearchService.search(searchTerm);
    }
  }
}
</script>