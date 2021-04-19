<template>
  <div>
    <div v-for="(action, index) in test.actions" :key="index">
      <v-select outlined dense :value="action.type" @input="updateActionField(index, 'type', $event)"
        :items="actionTypes" label="Type"></v-select>
      <v-text-field v-if="action.type === 'click' || action.type === 'focus' || action.type === 'hover' ||
          action.type === 'waitForSelector'"
        outlined dense label="Selector"
        :value="action.selector" @input="updateActionField(index, 'selector', $event)"
        ></v-text-field>
      <v-text-field v-else-if="action.type === 'waitForTimeout'"
        outlined dense label="Delay" type="number"
        :value="action.delay" @input="updateActionField(index, 'delay', $event)"
        ></v-text-field>
      <v-text-field v-else-if="action.type === 'pressKey'"
        outlined dense label="Key"
        :value="action.key" @input="updateActionField(index, 'key', $event)"
        ></v-text-field>
      <v-text-field v-else-if="action.type === 'text'"
        outlined dense label="Text"
        :value="action.text" @input="updateActionField(index, 'text', $event)"
        ></v-text-field>
      <div v-else-if="action.type === 'mouseMove' && action.coordinate">
        <v-text-field class="flex-grow-1 flex-shrink-1" outlined dense label="X coordinate" type="number"
          :value="action.coordinate.x" @input="updateField("", $event)"
          ></v-text-field>
        <v-text-field class="flex-grow-1 flex-shrink-1" outlined dense label="Y coordinate" type="number"
          :value="action.coordinate.y" @input="updateField("", $event)"
          ></v-text-field>
      </div>
    </div>
    <v-btn @click="addAction">
      Add action
    </v-btn>
  </div>
</template>

<script lang="ts">
import { BackstopTest } from "@/models/backstopTest";
import { Component, Vue, Prop } from "vue-property-decorator";
import { Mutation } from "vuex-class";

/**
 * case 'click':
    await page.waitForSelector(selector);
    await page.click(selector);
  case 'focus':
    await page.waitForSelector(selector);
    await page.focus(selector);
  case 'hover':
    await page.waitForSelector(selector);
    await page.hover(selector);
  case 'waitForTimeout':
    await page.waitForTimeout(delay);
  case 'waitForSelector':
    await page.waitForSelector(selector);
  case 'pressKey':
    await page.keyboard.press(key);
  case 'type':
    await page.keyboard.type(text);
  case 'mouseMove':
    await page.mouse.move(coordinate.x, coordinate.y);
 */

@Component
export default class TestActionsComponent extends Vue {
  @Prop({ required: true, type: BackstopTest})
  private readonly test!: BackstopTest;

  @Mutation("configurationStore/addAction")
  private readonly addAction!: (payload: { scenarioIndex: number }) => void;

  private actionTypes: string[];

  constructor() {
    super(arguments);
    this.actionTypes = ["click", "focus", "hover", "waitForTimeout",
      "waitForSelector", "pressKey", "type", "mouseMove"];
  }

  private addActionForCurrentTest() {
    this.addAction({});
  }

  private updateActionField(actionIndex: number, field: string, value: unknown) {

  }
}
</script>
