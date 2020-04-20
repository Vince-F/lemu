<template>
  <v-dialog
      v-model="dialogDisplayed"
      max-width="400"
    >
    <v-card>
      <v-card-title class="headline">Unsaved changes</v-card-title>

      <v-card-text>
        You have unsaved changes. Would you like to save them?
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          color="primary darken-1"
          text
          @click="save"
        >
          Save
        </v-btn>

        <v-btn
          color="grey darken-1"
          text
          @click="discard"
        >
          Discard changes
        </v-btn>

        <v-btn
          color="grey darken-1"
          text
          @click="dismiss"
        >
          cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog> 
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({})
export default class SaveConfirmationModalComponent extends Vue {
  private dialogDisplayed: boolean = true;

  private discard() {
    this.dialogDisplayed = false;
    this.$emit("discard");
  }

  private dismiss() {
    this.dialogDisplayed = false;
    this.$emit("dismiss");
  }

  private save() {
    this.dialogDisplayed = false;
    this.$emit("save");
  }
}
</script>