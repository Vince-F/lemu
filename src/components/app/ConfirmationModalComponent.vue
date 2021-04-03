<template>
  <v-dialog v-model="dialogDisplayed" max-width="400">
    <v-card>
      <v-card-title class="headline">Confirmation</v-card-title>

      <v-card-text>
        {{ textContent }}
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn color="primary darken-1" text @click="accept"> Yes </v-btn>

        <v-btn color="grey darken-1" text @click="dismiss"> No </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({})
export default class ConfirmationModalComponent extends Vue {
  @Prop({ required: true, type: String })
  private textContent!: string;

  private dialogDisplayed = true;

  private accept() {
    this.dialogDisplayed = false;
    this.$emit("accept");
  }

  private dismiss() {
    this.dialogDisplayed = false;
    this.$emit("dismiss");
  }
}
</script>
