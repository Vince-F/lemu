<template>
  <div>
    <v-text-field outlined dense type="number" label="Maximum parallel captures (asyncCaptureLimit)" :value="configuration.asyncCaptureLimit" 
      @input="updateField('asyncCaptureLimit', Number.parseInt($event))"></v-text-field>
    <v-text-field outlined dense type="number" label="Maximum parallel screen comparison (asyncCompareLimit)" :value="configuration.asyncCompareLimit" 
      @input="updateField('asyncCompareLimit', Number.parseInt($event))"></v-text-field>
    <v-checkbox label="Debug window" :input-value="configuration.debugWindow" @change="updateField('debugWindow', $event)"></v-checkbox>
    <v-checkbox label="Debug output" :input-value="configuration.debug" @change="updateField('debug', $event)"></v-checkbox>
  </div>
</template>

<script lang="ts">
import { BackstopConfiguration } from "@/models/backstopConfiguration";
import { Vue, Component } from "vue-property-decorator";

@Component
export default class PerformanceConfigurationComponent extends Vue {
  @Prop({required: true})
  private readonly configuration!: BackstopConfiguration;

  private updateField(field: string, value: any) {
    this.$emit(field, value);
  }
}
</script>