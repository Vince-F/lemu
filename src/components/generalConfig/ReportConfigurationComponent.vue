<template>
  <div>
    <v-checkbox label="HTML report" :input-value="htmlReportEnabled" @change="updateReport('browser', $event)"></v-checkbox>
    <v-checkbox label="CI report" :input-value="ciReportEnabled" @change="updateReport('ci', $event)"></v-checkbox>
    <v-checkbox label="JSON report" :input-value="jsonReportEnabled" @change="updateReport('json', $event)"></v-checkbox>
    <v-text-field outlined dense label="Path for HTML report" :value="configuration.paths.html_report" @input="updatePathField('html_report', $event)"></v-text-field>
    <v-text-field outlined dense label="Path for CI report" :value="configuration.paths.ci_report" @input="updatePathField('ci_report', $event)"></v-text-field>
    <v-text-field outlined dense label="Path for JSON report" :value="configuration.paths.json_report" @input="updatePathField('json_report', $event)"></v-text-field>
  </div>
</template>

<script lang="ts">
import { BackstopConfiguration } from "@/models/backstopConfiguration";
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class ReportConfigurationComponent extends Vue {
  @Prop({ required: true })
  private readonly configuration!: BackstopConfiguration;

  private get ciReportEnabled() {
    return this.configuration.report.indexOf("CI") > -1;
  }

  private get jsonReportEnabled() {
    return this.configuration.report.indexOf("json") > -1;
  }

  private get htmlReportEnabled() {
    return this.configuration.report.indexOf("browser") > -1;
  }

  private updateReport(type: string, value: string) {
    this.$emit("updateReport", type, value);
  }

  private updatePathField(type: string, value: string) {
    this.$emit("updatePathField", type, value);
  }
}
</script>