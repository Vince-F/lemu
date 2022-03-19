<template>
  <v-dialog
      v-model="dialogDisplayed"
      max-width="400"
    >
    <v-card>
      <v-card-title class="headline">Add field</v-card-title>
      <v-card-text>
        <v-form v-model="valid" ref="form">
          <test-action-form-component :action="newAction"
            @action-field-updated="updateActionField"
            @action-coordinate-field-updated="updateActionCoordinateField"
            />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary darken-1"
          text
          @click="addAction"
        >
          Add
        </v-btn>

        <v-btn
          color="grey darken-1"
          text
          @click="dismiss"
        >
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { TestAction } from "@/models/testAction";
import { Vue, Component } from "vue-property-decorator";
import TestActionFormComponent from "./TestActionFormComponent.vue";

@Component({
  components: {
    TestActionFormComponent
  }
})
export default class AddTestFieldModalComponent extends Vue {
  private dialogDisplayed: boolean;
  private newAction: TestAction;
  private valid: boolean;

  constructor() {
    super(arguments);
    this.dialogDisplayed = true;
    this.newAction = new TestAction();
    this.valid = false;
  }

  private addAction() {
    const formComponent: unknown = this.$refs.forms;
    if (formComponent && Object.prototype.hasOwnProperty.call(formComponent, "validate")) {
      (formComponent as {validate: () => void }).validate();
    }
    if (this.valid) {
      this.dialogDisplayed = false;
      this.$emit("validate", {
        action: this.newAction
      });
    }
  }

  private dismiss() {
    this.dialogDisplayed = false;
    this.$emit("dismiss");
  }

  private updateActionField(field: string, value: unknown) {
    if (field === "type" && value === "mouseMove" && !this.newAction.coordinate) {
      Vue.set(this.newAction, "coordinate", { x: 0, y: 0 });
    }
    Vue.set(this.newAction, field, value);
  }

  private updateActionCoordinateField(field: string, value: unknown) {
    if (!this.newAction.coordinate) {
      Vue.set(this.newAction, "coordinate", { x: 0, y: 0 });
    }
    if (this.newAction.coordinate) {
      Vue.set(this.newAction.coordinate, field, value);
    }
  }
}
</script>
