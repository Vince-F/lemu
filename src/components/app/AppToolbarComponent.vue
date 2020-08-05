<template>
  <v-app-bar app color="primary" dark>
    <div class="d-flex align-center">
      <v-img
        alt="Lemu Logo"
        class="shrink mr-2"
        contain
        src="../../assets/icon.png"
        transition="scale-transition"
        width="40"
      />

      <h1 class="app-title">LEMU</h1>
    </div>

    <v-spacer></v-spacer>
    <div class="search-container" v-if="hasConfiguration">
      <v-autocomplete
        v-model="selectedTest"
        :items="foundTests"
        @update:search-input="updateTestSearchInput"
        @change="goToTest"
        label="Search in tests"
      ></v-autocomplete>   
    </div> 
    <v-spacer></v-spacer>

    <v-btn text v-on:click="runTests" v-if="hasConfiguration" :disabled="testRunning">
      <template v-if="!testRunning">
        <v-icon>mdi-play</v-icon>
        Run tests
      </template>
      <template v-else>
        <v-progress-circular
          indeterminate
          color="white"
        ></v-progress-circular>
        Tests running
      </template>
    </v-btn>

    <v-btn text v-on:click="openConfig">
      <v-icon>mdi-folder-open</v-icon>
      Open...
    </v-btn>

    <v-btn text v-on:click="save" v-if="hasConfiguration">
      <v-icon>mdi-content-save</v-icon>
      Save
    </v-btn>
    <v-btn text v-on:click="close" v-if="hasConfiguration">
      <v-icon>mdi-exit-to-app</v-icon>
      Close
    </v-btn>
    <v-btn text v-on:click="displayAbout">
      <v-icon>mdi-information</v-icon>
      About
    </v-btn>
  </v-app-bar>
</template>

<style scoped>
  .search-container {
    margin-top: 24px;
  }

  .v-btn .v-icon {
    margin-right: 8px;
  }
</style>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Action, Mutation, Getter, State } from "vuex-class";
import { ModalService } from '../../services/modalService';
import AboutModalComponent from "./AboutModalComponent.vue";
import { BackstopTest } from '../../models/backstopTest';
import { SearchService } from '../../services/searchService';
import { BackstopService } from '../../services/backstopService';

@Component({

})
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
  @Mutation("applicationStore/displaySnackbar")
  private readonly displaySnackbar!: (payload: {text: string, success: boolean}) => void;
  @Action("engineScriptStore/saveAllScripts")
  private readonly saveAllScripts!: () => Promise<void>;
  @Action("configurationStore/openConfiguration")
  private openConfiguration!: () => Promise<any>;

  private selectedTest: number | null;
  private foundTests: any[];

  constructor() {
    super(arguments);
    this.selectedTest = null;
    this.foundTests = [];
  }

  private close() {
    if (this.hasConfigurationBeenModified) {
      ModalService.launchSaveConfirmationModal()
      .then((action) => {
        switch (action) {
          case 'discard':
            this.dismissAndGoToStartScreen();
            break;
          case 'save':
            this.save()
              .then(() => {
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
    BackstopService.unregisterResultWatcher();
    this.$router.push("/");
  }

  private displayAbout() {
    ModalService.launchModal(AboutModalComponent);
  }

  private goToTest() {
    this.$router.push(`/tests/list/test/${this.selectedTest}`);
  }

  private openConfig() {
    if (this.hasConfigurationBeenModified) {
      ModalService.launchSaveConfirmationModal()
      .then((action) => {
        switch (action) {
          case 'discard':
            this.openConfigAndGoToTestView();
            break;
          case 'save':
            this.save()
              .then(() => {
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
      }).catch((error) => {
        if (typeof error !== "string" || error !== "dismiss") {
          this.displaySnackbar({text: "Failed to open file. " + error, success: false});
        }
      });
  }

  private runTests() {
    this.runBackstopTests()
      .then((result) => {
        this.displaySnackbar({text: "Tests successful", success: true});
      }).catch((error) => {
        this.displaySnackbar({text: "Tests failed. Open the logs to see more details.", success: false});
      });
  }

  private save() {
    return Promise.all([
      this.saveConfiguration(),
      this.saveAllScripts()
    ])
      .then(() => {
        this.displaySnackbar({text: "File saved", success: true});
      }).catch((error) => {
        this.displaySnackbar({text: "Failed to save file: " + error, success: false});
      });
  }

  private updateTestSearchInput(searchTerm: string) {
    if (searchTerm) {
      this.foundTests = SearchService.search(searchTerm);
    }
  }
}
</script>