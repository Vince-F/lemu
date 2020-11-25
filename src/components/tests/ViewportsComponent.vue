<template>
  <div>
    <div v-for="(viewport, index) in viewports" :key="index">
      <hr v-if="index > 0" class="ma-4">
      <div class="d-flex">
        <strong class="flex-grow-1 flex-shrink-1">
          Viewport {{index}}
        </strong>
        <v-btn color="error" class="flex-grow-0 flex-shrink-0" @click="removeViewport(index)">
          <v-icon>mdi-delete</v-icon>
          Remove viewport
        </v-btn>
      </div>
      <v-text-field label="label" :value="viewport.label" @input="updateViewportField(index, 'label', $event)"></v-text-field>
      <div class="d-flex">
        <v-text-field class="mr-2" type="number" min="0" step="1" label="width" :value="viewport.width" @input="updateViewportField(index, 'width', Number.parseInt($event))"></v-text-field>
        <v-text-field class="ml-2" type="number" min="0" step="1" label="height" :value="viewport.height" @input="updateViewportField(index, 'height', Number.parseInt($event))"></v-text-field>
      </div>
    </div>
    <v-btn color="primary" v-on:click="addViewport">
      <v-icon>mdi-add</v-icon>
      Add viewport
    </v-btn>
  </div>
</template>

<script lang="ts">
import { Viewport } from '@/models/viewport';
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class ViewportsComponent extends Vue {
  @Prop({required: true, type: Array})
  private readonly viewports!: Viewport[];

  private addViewport() {
    this.$emit("addViewport");
  }

  private removeViewport(index: number) {
    this.$emit("removeViewport", index);
  }

  private updateViewportField(index: number, field: string, value: any) {
    this.$emit("updateViewportField", index, field, value);
  }
}
</script>