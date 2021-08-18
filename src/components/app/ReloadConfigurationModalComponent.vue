<template>
  <v-dialog v-model="dialogDisplayed" max-width="400" persistent>
    <v-card>
      <v-card-title class="headline">Modification outside of LEMU</v-card-title>

      <v-card-text>
        The configuration has been modified from outside of LEMU. However you
        have also pending changes. Would you like to keep your changes or
        reload?
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="primary darken-1" text @click="keepChangesAndSave">
          Keep changes
        </v-btn>

        <v-btn color="grey darken-1" text @click="discardAndReload">
          Discard and reload
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({})
export default class ReloadConfigurationModalComponent extends Vue {
  private dialogDisplayed = true;

  private keepChangesAndSave() {
    this.dialogDisplayed = false;
    this.$emit("validate", { reload: false });
  }

  private discardAndReload() {
    this.dialogDisplayed = false;
    this.$emit("validate", { reload: true });
  }
}
</script>
