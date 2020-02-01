<template>
  <v-card outlined height="100%" max-height="100%">
    <v-expansion-panels multiple>
      <v-expansion-panel>
        <v-expansion-panel-header>General</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-text-field label="id" :value="configuration.id" @input="updateField('id', $event)"></v-text-field>
          <v-text-field label="OnBeforeScript" :value="configuration.onBeforeScript" @input="updateField('onBeforeScript', $event)"></v-text-field>
          <v-text-field label="onReadyScript" :value="configuration.onReadyScript" @input="updateField('onReadyScript', $event)"></v-text-field>
          <v-text-field label="Path for reference bitmaps" :value="configuration.paths.bitmaps_reference" @input="updatePathField('bitmaps_reference', $event)"></v-text-field>
          <v-text-field label="Path for test bitmaps" :value="configuration.paths.bitmaps_test" @input="updatePathField('bitmaps_test', $event)"></v-text-field>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header>Viewports ({{configuration.viewports.length || 0}})</v-expansion-panel-header>
        <v-expansion-panel-content>
          <div v-for="(viewport, index) in configuration.viewports" :key="index">
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
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header>Engine</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-radio-group :value="configuration.engine" @change="updateField('engine', $event)">
            <v-radio label="Puppeteer" value="puppeteer"></v-radio>
            <v-radio label="Chromy" value="chromy"></v-radio>
          </v-radio-group>
          <strong>Engine options</strong>
          <div v-for="(value, key) of configuration.engineOptions" :key="key">
            <v-combobox v-if="Array.isArray(value)" multiple chips
              :label="key" :value="value" @change="setConfigurationEngineOptionsField({field: key, value: $event})"
              ></v-combobox>
            <v-text-field v-else-if="typeof value === 'number'" type="number"
              :label="key" :value="value" @change="setConfigurationEngineOptionsField({field: key, value: $event})"
              ></v-text-field>
            <v-checkbox v-else-if="typeof value === 'boolean'" 
              :label="key" :value="value" @change="setConfigurationEngineOptionsField({field: key, value: !!$event})"
              ></v-checkbox>
            <v-text-field v-else
              :label="key" :value="value" @change="setConfigurationEngineOptionsField({field: key, value: $event})"></v-text-field>
          </div>
          <v-btn color="primary" v-on:click="addEngineOption()">
            <v-icon>mdi-add</v-icon>
            Add engine option
          </v-btn>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header>Report</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-checkbox label="HTML report" :input-value="htmlReportEnabled" @change="updateReport('browser', $event)"></v-checkbox>
          <v-checkbox label="CI report" :input-value="ciReportEnabled" @change="updateReport('ci', $event)"></v-checkbox>
          <v-checkbox label="JSON report" :input-value="jsonReportEnabled" @change="updateReport('json', $event)"></v-checkbox>
          <v-text-field label="Path for HTML report" :value="configuration.paths.html_report" @input="updatePathField('html_report', $event)"></v-text-field>
          <v-text-field label="Path for CI report" :value="configuration.paths.ci_report" @input="updatePathField('ci_report', $event)"></v-text-field>
          <v-text-field label="Path for JSON report" :value="configuration.paths.json_report" @input="updatePathField('json_report', $event)"></v-text-field>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { State, Mutation } from "vuex-class";
import { BackstopConfiguration } from "../models/backstopConfiguration";
import { ModalService } from '../services/modalService';
import AddEngineOptionModalComponent from "./AddEngineOptionModalComponent.vue";

@Component({
  name: "general-configuration-component"
})
export default class GeneralConfigurationComponent extends Vue {
  @State((state) => state.configurationStore.currentConfiguration)
  private configuration!: BackstopConfiguration;
  @Mutation("configurationStore/addViewport")
  private addViewportInConfig!: () => void;
  @Mutation("configurationStore/removeViewport")
  private removeViewportInConfig!: (index: number) => void;
  @Mutation("configurationStore/setConfigurationField")
  private setConfigurationField!: Function;
  @Mutation("configurationStore/setConfigurationPathField")
  private setConfigurationPathField!: Function;
  @Mutation("configurationStore/setConfigurationReport")
  private setConfigurationReport!: Function;
  @Mutation("configurationStore/setConfigurationViewportField")
  private setConfigurationViewportField!: Function;
  @Mutation("configurationStore/setConfigurationEngineOptionsField")
  private setConfigurationEngineOptionsField!: (payload: {field: string, value: any}) => void;

  private get ciReportEnabled() {
    return this.configuration.report.indexOf("CI") > -1;
  }

  private get jsonReportEnabled() {
    return this.configuration.report.indexOf("json") > -1;
  }

  private get htmlReportEnabled() {
    return this.configuration.report.indexOf("browser") > -1;
  }

  private addEngineOption() {
    ModalService.launchModal(AddEngineOptionModalComponent)
      .then((newField: {name: string, value: any, type: string}) => {
        if (newField.type === "number") {
          newField.value = Number.parseFloat(newField.value);
        }
        this.setConfigurationEngineOptionsField({field: newField.name, value: newField.value});
      });
  }

  private addViewport() {
    this.addViewportInConfig();
  }

  private removeViewport(index: number) {
    this.removeViewportInConfig(index);
  }

  private updateField(field: string, value: any) {
    this.setConfigurationField({field, value});
  }

  private updatePathField(field: string, value: any) {
    this.setConfigurationPathField({field, value});
  }

  private updateReport(reportType: string, kept: boolean) {
    this.setConfigurationReport({reportType, kept});
  }

  private updateViewportField(viewportIndex: number, field: string, value: any) {
    this.setConfigurationViewportField({viewportIndex, field, value});
  }
}
</script>