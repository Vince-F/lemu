<template>
  <div>
    <div v-for="(action, index) in test.actions" :key="index">
      <v-select outlined dense :value="action.type" @input="updateCurrentActionField(index, 'type', $event)"
        :items="actionTypes" label="Type"></v-select>
      <v-text-field v-if="action.type === 'click' || action.type === 'focus' || action.type === 'hover' ||
          action.type === 'waitForSelector'"
        outlined dense label="Selector"
        :value="action.selector" @input="updateCurrentActionField(index, 'selector', $event)"
        ></v-text-field>
      <v-text-field v-else-if="action.type === 'waitForTimeout'"
        outlined dense label="Delay" type="number"
        :value="action.delay" @input="updateCurrentActionField(index, 'delay', $event)"
        ></v-text-field>
      <v-text-field v-else-if="action.type === 'pressKey'"
        outlined dense label="Key"
        :value="action.key" @input="updateCurrentActionField(index, 'key', $event)"
        ></v-text-field>
      <v-text-field v-else-if="action.type === 'text'"
        outlined dense label="Text"
        :value="action.text" @input="updateCurrentActionField(index, 'text', $event)"
        ></v-text-field>
      <div v-else-if="action.type === 'mouseMove' && action.coordinate">
        <v-text-field class="flex-grow-1 flex-shrink-1" outlined dense label="X coordinate" type="number"
          :value="action.coordinate.x" @input="updateCurrentActionCoordinateField(index, 'x', parseInt($event))"
          ></v-text-field>
        <v-text-field class="flex-grow-1 flex-shrink-1" outlined dense label="Y coordinate" type="number"
          :value="action.coordinate.y" @input="updateCurrentActionCoordinateField(index, 'y', parseInt($event))"
          ></v-text-field>
      </div>
    </div>
    <v-btn @click="addActionForCurrentTest">
      Add action
    </v-btn>
  </div>
</template>

<script lang="ts">
import { BackstopTest } from "@/models/backstopTest";
import { Component, Vue, Prop } from "vue-property-decorator";
import { Mutation } from "vuex-class";

@Component
export default class TestActionsComponent extends Vue {
  @Prop({ required: true, type: BackstopTest })
  private readonly test!: BackstopTest;

  @Prop({ required: true, type: Number })
  private readonly testIndex!: number;

  @Mutation("configurationStore/addAction")
  private readonly addAction!: (payload: { scenarioIndex: number }) => void;

  @Mutation("configurationStore/updateActionField")
  private readonly updateActionField!: (payload:
    { scenarioIndex: number, actionIndex: number, field: string, value: unknown }) => void;

  @Mutation("configurationStore/updateActionCoordinateField")
  private readonly updateActionCoordinateField!: (payload:
    { scenarioIndex: number, actionIndex: number, field: string, value: unknown}) => void;

  private actionTypes: string[];

  constructor() {
    super(arguments);
    this.actionTypes = ["click", "focus", "hover", "waitForTimeout",
      "waitForSelector", "pressKey", "type", "mouseMove"];
  }

  private addActionForCurrentTest() {
    this.addAction({ scenarioIndex: this.testIndex });
  }

  private updateCurrentActionField(actionIndex: number, field: string, value: unknown) {
    this.updateActionField({ scenarioIndex: this.testIndex, actionIndex, field, value});
  }

  private updateCurrentActionCoordinateField(actionIndex: number, field: string, value: number) {
    this.updateActionCoordinateField({ scenarioIndex: this.testIndex, actionIndex, field, value});
  }
}
</script>
