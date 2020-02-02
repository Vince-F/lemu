<template>
  <v-app-bar app color="primary" dark>
    <div class="d-flex align-center">
      <v-img
        alt="Lemu Logo"
        class="shrink mr-2"
        contain
        src="../assets/icon.png"
        transition="scale-transition"
        width="40"
      />

      <h1 class="app-title">LEMU</h1>
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

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Action, Mutation, Getter, State } from "vuex-class";
import { ModalService } from '../services/modalService';
import AboutModalComponent from "./modals/AboutModalComponent.vue";

@Component({

})
export default class AppToolbarComponent extends Vue {
  @Action("configurationStore/saveConfiguration")
  private saveConfiguration!: () => Promise<void>;
  @Mutation("configurationStore/dismissCurrentConfiguration")
  private dismissCurrentConfiguration!: () => void;
  @Getter("configurationStore/hasConfiguration")
  private hasConfiguration!: boolean;
  @Getter("configurationStore/hasConfigurationBeenModified")
  private hasConfigurationBeenModified!: boolean;
  @State((state) => state.configurationStore.testRunning)
  private testRunning!: boolean;
  @Action("testRunnerStore/runTests")
  private runBackstopTests!: () => Promise<any>;
  @Mutation("applicationStore/displaySnackbar")
  private readonly displaySnackbar!: (payload: {text: string, success: boolean}) => void;

  private close() {
    if (this.hasConfigurationBeenModified) {
      ModalService.launchSaveConfirmationModal()
      .then((action) => {
        switch (action) {
          case 'discard':
            this.dismissCurrentConfiguration();
            this.$router.push("/");
            break;
          case 'save':
            this.save()
              .then(() => {
                this.dismissCurrentConfiguration();
                this.$router.push("/");
              });
            break;
        }
      });
    } else {
      this.dismissCurrentConfiguration();
      this.$router.push("/");
    }
  }

  private displayAbout() {
    ModalService.launchModal(AboutModalComponent);
  }

  private runTests() {
    this.runBackstopTests()
      .then((result) => {
        this.displaySnackbar({text: "Tests successful", success: true});
      }).catch((error) => {
        this.displaySnackbar({text: "Tests failed. Open the report to see more details.", success: false});
      });
  }

  private save() {
    return this.saveConfiguration()
      .then(() => {
        this.displaySnackbar({text: "File saved", success: true});
      }).catch((error) => {
        this.displaySnackbar({text: "Failed to save file: " + error, success: false});
      });
  }
}
</script>