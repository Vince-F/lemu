<template>
  <div>
    <v-select outlined dense :value="action.type" @input="updateActionField('type', $event)"
      :items="actionTypes" label="Type"></v-select>
    <v-text-field v-if="action.type === 'click' || action.type === 'focus' || action.type === 'hover' ||
        action.type === 'waitForSelector'"
      outlined dense label="Selector"
      :value="action.selector" @input="updateActionField('selector', $event)"
      ></v-text-field>
    <v-text-field v-else-if="action.type === 'waitForTimeout'"
      outlined dense label="Delay" type="number"
      :value="action.delay" @input="updateActionField('delay', $event)"
      ></v-text-field>
    <v-text-field v-else-if="action.type === 'pressKey'"
      outlined dense label="Key"
      :value="action.key" @input="updateActionField('key', $event)"
      ></v-text-field>
    <v-text-field v-else-if="action.type === 'type'"
      outlined dense label="Text"
      :value="action.text" @input="updateActionField('text', $event)"
      ></v-text-field>
    <div v-else-if="action.type === 'mouseMove' && action.coordinate">
      <v-text-field class="flex-grow-1 flex-shrink-1" outlined dense label="X coordinate" type="number"
        :value="action.coordinate.x" @input="updateActionCoordinateField('x', parseInt($event))"
        ></v-text-field>
      <v-text-field class="flex-grow-1 flex-shrink-1" outlined dense label="Y coordinate" type="number"
        :value="action.coordinate.y" @input="updateActionCoordinateField('y', parseInt($event))"
        ></v-text-field>
    </div>
  </div>
</template>

<script lang="ts">
import { TestAction } from "@/models/testAction";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class TestActionFormComponent extends Vue {
  @Prop({ required: true, type: Object })
  private readonly action!: TestAction;

  private actionTypes: string[];

  constructor() {
    super(arguments);
    this.actionTypes = ["click", "focus", "hover", "waitForTimeout",
      "waitForSelector", "pressKey", "type", "mouseMove"];
  }

  private updateActionField(field: string, value: unknown) {
    this.$emit("action-field-updated", field, value);
  }

  private updateCurrentActionCoordinateField(field: string, value: number) {
    this.$emit("action-coordinate-field-updated", field, value);
  }
}
</script>
