<template>
  <div>
    <div class="d-flex">
      <h2 class="flex-grow-1 flex-shrink-1">ACTIONS</h2>
      <v-btn icon class="flex-grow-0 flex-shrink-0" @click="removeActions">
        <v-icon color="grey">mdi-delete</v-icon>
      </v-btn>
    </div>
    <fieldset v-for="(action, index) in test.actions" :key="index"
      class="pa-2">
      <div class="d-flex">
        <h3 class="flex-grow-1 flex-shrink-1">Action n°{{index + 1}}</h3>
        <div class="flex-grow-0 flex-shrink-0">
          <v-btn icon @click="removeCurrentAction(index)">
            <v-icon color="grey">mdi-delete</v-icon>
          </v-btn>
        </div>
      </div>
      <test-action-form-component :action="action"
        @action-field-updated="updateSpecificActionField(index, arguments[0], arguments[1])"
        @action-coordinate-field-updated="updateSpecificActionCoordinateField(index, arguments[0], arguments[1])"/>
    </fieldset>
    <div>
      <v-btn @click="addActionForCurrentTest">
        Add action
      </v-btn>
    </div>
  </div>
</template>

<style scoped>
  fieldset {
    border-radius: .25rem;
    border: 0.0625rem solid rgba(0, 0, 0, .14);
  }

  .theme--dark fieldset {
    border-color: rgba(255, 255, 255, .14)
  }

  fieldset {
    margin: .5rem;
  }

  h3 {
    margin-bottom: .25rem;
  }

</style>

<script lang="ts">
import { BackstopTest } from "@/models/backstopTest";
import { ModalService } from "@/services/modalService";
import { Component, Vue, Prop } from "vue-property-decorator";
import { Mutation } from "vuex-class";
import TestActionFormComponent from "./TestActionFormComponent.vue";
import AddActionModalComponent from "./AddActionModalComponent.vue";
import { TestAction } from "@/models/testAction";

@Component({
  components: {
    AddActionModalComponent,
    TestActionFormComponent
  }
})
export default class TestActionsComponent extends Vue {
  @Prop({ required: true })
  private readonly test!: BackstopTest;

  @Prop({ required: true, type: Number })
  private readonly testIndex!: number;

  @Mutation("configurationStore/addAction")
  private readonly addAction!: (payload: { scenarioIndex: number, action?: TestAction }) => void;

  @Mutation("configurationStore/updateActionField")
  private readonly updateActionField!: (payload:
    { scenarioIndex: number, actionIndex: number, field: string, value: unknown }) => void;

  @Mutation("configurationStore/updateActionCoordinateField")
  private readonly updateActionCoordinateField!: (payload:
    { scenarioIndex: number, actionIndex: number, field: string, value: unknown}) => void;

  @Mutation("configurationStore/removeAction")
  private readonly removeAction!: (payload: { scenarioIndex: number, actionIndex: number }) => void;

  private actionTypes: string[];

  constructor() {
    super(arguments);
    this.actionTypes = ["click", "focus", "hover", "waitForTimeout",
      "waitForSelector", "pressKey", "type", "mouseMove"];
  }

  private addActionForCurrentTest() {
    ModalService.launchModal(AddActionModalComponent)
      .then((result: {action: TestAction}) => {
        this.addAction({ scenarioIndex: this.testIndex, action: result.action });
      });
  }

  private updateSpecificActionField(actionIndex: number, field: string, value: unknown) {
    this.updateActionField({ scenarioIndex: this.testIndex, actionIndex, field, value });
    if (this.test.actions[actionIndex].type !== "mouseMove") {
      this.updateActionField({ scenarioIndex: this.testIndex, actionIndex, field: "coordinate", value: undefined });
    } else if (this.test.actions[actionIndex].type === "mouseMove" && !this.test.actions[actionIndex].coordinate) {
      this.updateActionField({ scenarioIndex: this.testIndex, actionIndex, field: "coordinate", value: { x: 0, y: 0 } });
    }
  }

  private updateSpecificActionCoordinateField(actionIndex: number, field: string, value: number) {
    this.updateActionCoordinateField({ scenarioIndex: this.testIndex, actionIndex, field, value });
  }

  private removeActions() {
    this.$emit("actions-removed");
  }

  private removeCurrentAction(index: number) {
    ModalService.launchConfirmationModal("Do you really want to delete this action?")
      .then(() => {
        this.removeAction({ scenarioIndex: this.testIndex, actionIndex: index });
      });
  }
}
</script>
