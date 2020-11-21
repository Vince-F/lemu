<template>
  <v-card outlined height="100%" max-height="100%">
    <v-expansion-panels multiple>
      <v-expansion-panel>
        <v-expansion-panel-header>General</v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-text-field label="id" :value="configuration.id" @input="updateField('id', $event)"></v-text-field>
          <v-select :value="configuration.onBeforeScript" @input="updateField('onBeforeScript', $event)" :items="scriptNames"
            label="onBeforeScript" multiple></v-select>
          <v-select :value="configuration.onReadyScript" @input="updateField('onReadyScript', $event)" :items="scriptNames"
            label="onReadyScript" multiple></v-select>
          <v-text-field label="Path for reference bitmaps" :value="configuration.paths.bitmaps_reference" @input="updatePathField('bitmaps_reference', $event)"></v-text-field>
          <v-text-field label="Path for test bitmaps" :value="configuration.paths.bitmaps_test" @input="updatePathField('bitmaps_test', $event)"></v-text-field>
        </v-expansion-panel-content>
      </v-expansion-panel>

      <v-expansion-panel>
        <v-expansion-panel-header>Viewports ({{configuration.viewports.length || 0}})</v-expansion-panel-header>
        <v-expansion-panel-content>
          <viewports-component :viewports="configuration.viewports" @addViewport="addViewport"
            @removeViewport="removeViewport" @updateViewportField="updateViewportField"/>
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
          <div v-for="(value, key) of configuration.engineOptions" :key="key" class="d-flex">
            <v-combobox v-if="Array.isArray(value)" class="flex-shrink-1 flex-grow-1" multiple chips
              :label="key" :value="value" @change="setConfigurationEngineOptionsField({field: key, value: $event})"
              ></v-combobox>
            <v-text-field v-else-if="typeof value === 'number'" class="flex-shrink-1 flex-grow-1" type="number"
              :label="key" :value="value" @change="setConfigurationEngineOptionsField({field: key, value: $event})"
              ></v-text-field>
            <v-checkbox v-else-if="typeof value === 'boolean'" class="flex-shrink-1 flex-grow-1"
              :label="key" :value="value" @change="setConfigurationEngineOptionsField({field: key, value: !!$event})"
              ></v-checkbox>
            <v-text-field v-else class="flex-shrink-1 flex-grow-1"
              :label="key" :value="value" @change="setConfigurationEngineOptionsField({field: key, value: $event})"></v-text-field>
            <v-btn icon class="flex-shrink-0 flex-grow-0 delete-action-btn" @click="confirmEngineOptionRemove(key)">
              <v-icon color="grey">mdi-delete</v-icon>
            </v-btn>
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

<style scoped>
  .delete-action-btn {
    align-self: center;
  }
</style>

<script lang="ts">
import { EngineScript } from '@/models/engineScript';
import { Vue, Component } from "vue-property-decorator";
import { State, Mutation, Getter, Action } from "vuex-class";
import { BackstopConfiguration } from "../../models/backstopConfiguration";
import { ModalService } from '../../services/modalService';
import AddEngineOptionModalComponent from "./AddEngineOptionModalComponent.vue";
import ViewportsComponent from "../tests/ViewportsComponent.vue";

@Component({
  name: "general-configuration-component",
  components: {
    ViewportsComponent
  }
})
export default class GeneralConfigurationComponent extends Vue {
  @State((state) => state.configurationStore.currentConfiguration)
  private readonly configuration!: BackstopConfiguration;
  @Mutation("configurationStore/addViewport")
  private readonly addViewportInConfig!: () => void;
  @Mutation("configurationStore/removeViewport")
  private readonly removeViewportInConfig!: (index: number) => void;
  @Mutation("configurationStore/setConfigurationField")
  private readonly setConfigurationField!: (payload: {field: string, value: any}) => void;
  @Mutation("configurationStore/setConfigurationPathField")
  private readonly setConfigurationPathField!: (payload: {field: string, value: any}) => void;
  @Mutation("configurationStore/setConfigurationReport")
  private readonly setConfigurationReport!: (payload: {reportType: string, kept: boolean}) => void;
  @Mutation("configurationStore/setConfigurationViewportField")
  private readonly setConfigurationViewportField!:
    (payload: {viewportIndex: number, field: string, value: any}) => void;
  @Mutation("configurationStore/setConfigurationEngineOptionsField")
  private readonly setConfigurationEngineOptionsField!: (payload: {field: string, value: any}) => void;
  @Mutation("configurationStore/removeEngineOption")
  private readonly removeEngineOption!: (fieldName: string) => void;
  @State((state) => state.engineScriptStore.scripts)
  private readonly scripts!: EngineScript[];
  @Getter("configurationStore/engineScriptDirectory")
  private readonly engineScriptDirectory!: string;
  @Action("engineScriptStore/retrieveEngineScripts")
  private readonly retrieveEngineScripts!: () => Promise<void>;

  private get ciReportEnabled() {
    return this.configuration.report.indexOf("CI") > -1;
  }

  private get jsonReportEnabled() {
    return this.configuration.report.indexOf("json") > -1;
  }

  private get htmlReportEnabled() {
    return this.configuration.report.indexOf("browser") > -1;
  }

  private get scriptNames() {
    let scriptDirectory = this.engineScriptDirectory.replace(/\\/g, "/");
    if (!scriptDirectory.endsWith("/")) {
      scriptDirectory += "/";
    }
    return this.scripts.map((script) => {
      return script.path.replace(scriptDirectory, "");
    });
  }

  private created() {
    if (!Array.isArray(this.configuration.onBeforeScript)) {
      this.updateField("onBeforeScript", [this.configuration.onBeforeScript]);
    }
    if (!Array.isArray(this.configuration.onReadyScript)) {
      this.updateField("onReadyScript", [this.configuration.onReadyScript]);
    }
    this.retrieveEngineScripts();
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

  private confirmEngineOptionRemove(fieldName: string) {
    ModalService.launchConfirmationModal("Do you really wish to delete this entry?")
      .then(() => {
        this.removeEngineOption(fieldName);
      });
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