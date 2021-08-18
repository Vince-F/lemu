<template>
  <v-dialog
      v-model="dialogDisplayed"
      max-width="400"
      persistent
    >
    <v-card>
      <v-card-title class="headline">Configuration name change</v-card-title>

      <v-card-text>
        Your configuration name has changed. Would you like to reame your reference
        files to the new configuration name?
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="primary darken-1" text @click="rename">
          Yes
        </v-btn>

        <v-btn color="grey darken-1" text @click="dismiss">
          No
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({})
export default class ReferenceRenameModalComponent extends Vue {
  private dialogDisplayed = true;

  private dismiss() {
    this.dialogDisplayed = false;
    this.$emit("dismiss");
  }

  private rename() {
    this.dialogDisplayed = false;
    this.$emit("validate");
  }
}
</script>
