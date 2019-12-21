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

    <v-btn text v-on:click="save" v-if="hasConfiguration">
      <v-icon>mdi-content-save</v-icon>
      Save
    </v-btn>
    <v-btn text v-on:click="close" v-if="hasConfiguration">
      <v-icon>mdi-exit-to-app</v-icon>
      Close
    </v-btn>

    <v-snackbar v-model="snackbarDisplayed">
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
        @click="snackbarDisplayed = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </v-app-bar>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Action, Mutation, Getter } from "vuex-class";
import { ConfirmationModalService } from '../services/confirmationModalService';

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

  private snackbarDisplayed: boolean;
  private snackbarText: string;
  private snackbarSuccess: boolean;

  constructor() {
    super(arguments);
    this.snackbarDisplayed = false;
    this.snackbarText = "";
    this.snackbarSuccess = false;
  }

  private close() {
    if (this.hasConfigurationBeenModified) {
      ConfirmationModalService.launchSaveConfirmationModal()
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

  private save() {
    return this.saveConfiguration()
      .then(() => {
        this.snackbarDisplayed = true;
        this.snackbarText = "File saved";
        this.snackbarSuccess = true;
      }).catch((error) => {
        alert(error);
        this.snackbarDisplayed = true;
        this.snackbarText = "Failed to save file: " + error;
        this.snackbarSuccess = false;
      });
  }
}
</script>