<template>
  <v-card outlined height="100%" max-height="100%" class="card">
    <v-card-title class="header flex-grow-0 flex-shrink-0">
      <div class="flex-grow-1 flex-shrink-1">
        General configuration 
      </div>
    </v-card-title>
    <v-card-text class="content flex-grow-1 flex-shrink-1">
      <v-tabs>
        <v-tab>General</v-tab>
        <v-tab-item>
          <v-text-field outlined dense label="id" :value="configuration.id" @input="updateField('id', $event)"></v-text-field>
          <v-select outlined dense :value="configuration.onBeforeScript" @input="updateField('onBeforeScript', $event)" :items="scriptNames"
            label="onBeforeScript"></v-select>
          <v-select outlined dense :value="configuration.onReadyScript" @input="updateField('onReadyScript', $event)" :items="scriptNames"
            label="onReadyScript"></v-select>
          <v-text-field outlined dense label="Path for reference bitmaps" :value="configuration.paths.bitmaps_reference" @input="updatePathField('bitmaps_reference', $event)"></v-text-field>
          <v-text-field outlined dense label="Path for test bitmaps" :value="configuration.paths.bitmaps_test" @input="updatePathField('bitmaps_test', $event)"></v-text-field>
        </v-tab-item>

        <v-tab>Viewports ({{configuration.viewports.length || 0}})</v-tab>
        <v-tab-item>
          <viewports-component :viewports="configuration.viewports" @addViewport="addViewport"
            @removeViewport="removeViewport" @updateViewportField="updateViewportField"/>
        </v-tab-item>

        <v-tab>Engine</v-tab>
        <v-tab-item>
          <v-radio-group :value="configuration.engine" @change="updateField('engine', $event)">
            <v-radio label="Puppeteer" value="puppeteer"></v-radio>
          </v-radio-group>
          <div class="mb-4">
            <strong>Engine options</strong>
          </div>
          <div v-for="(value, key) of configuration.engineOptions" :key="key" class="d-flex">
            <v-combobox outlined dense v-if="Array.isArray(value)" class="flex-shrink-1 flex-grow-1" multiple
              :label="key" :value="value" @change="setConfigurationEngineOptionsField({field: key, value: $event})"
              ></v-combobox>
            <v-text-field outlined dense v-else-if="typeof value === 'number'" class="flex-shrink-1 flex-grow-1" type="number"
              :label="key" :value="value" @change="setConfigurationEngineOptionsField({field: key, value: $event})"
              ></v-text-field>
            <v-checkbox v-else-if="typeof value === 'boolean'" class="flex-shrink-1 flex-grow-1"
              :label="key" :value="value" @change="setConfigurationEngineOptionsField({field: key, value: !!$event})"
              ></v-checkbox>
            <v-text-field outlined dense v-else class="flex-shrink-1 flex-grow-1"
              :label="key" :value="value" @change="setConfigurationEngineOptionsField({field: key, value: $event})"></v-text-field>
            <v-btn icon class="flex-shrink-0 flex-grow-0 delete-action-btn" @click="confirmEngineOptionRemove(key)">
              <v-icon color="grey">mdi-delete</v-icon>
            </v-btn>
          </div>
          <div class="action-container">
            <v-btn color="primary"  @click="addEngineOption()">
              <v-icon>mdi-plus</v-icon>
              Add engine option
            </v-btn>
          </div>
        </v-tab-item>

        <v-tab>Report</v-tab>
        <v-tab-item>
          <v-checkbox label="HTML report" :input-value="htmlReportEnabled" @change="updateReport('browser', $event)"></v-checkbox>
          <v-checkbox label="CI report" :input-value="ciReportEnabled" @change="updateReport('ci', $event)"></v-checkbox>
          <v-checkbox label="JSON report" :input-value="jsonReportEnabled" @change="updateReport('json', $event)"></v-checkbox>
          <v-text-field outlined dense label="Path for HTML report" :value="configuration.paths.html_report" @input="updatePathField('html_report', $event)"></v-text-field>
          <v-text-field outlined dense label="Path for CI report" :value="configuration.paths.ci_report" @input="updatePathField('ci_report', $event)"></v-text-field>
          <v-text-field outlined dense label="Path for JSON report" :value="configuration.paths.json_report" @input="updatePathField('json_report', $event)"></v-text-field>
        </v-tab-item>

        <v-tab>Perfomance</v-tab>
        <v-tab-item>
          <v-text-field outlined dense type="number" label="Maximum parallel captures (asyncCaptureLimit)" :value="configuration.asyncCaptureLimit" 
            @input="updateField('asyncCaptureLimit', Number.parseInt($event))"></v-text-field>
          <v-text-field outlined dense type="number" label="Maximum parallel screen comparison (asyncCompareLimit)" :value="configuration.asyncCompareLimit" 
            @input="updateField('asyncCompareLimit', Number.parseInt($event))"></v-text-field>
          <v-checkbox label="Debug window" :input-value="configuration.debugWindow" @change="updateField('debugWindow', $event)"></v-checkbox>
          <v-checkbox label="Debug output" :input-value="configuration.debug" @change="updateField('debug', $event)"></v-checkbox>
        </v-tab-item>
      </v-tabs>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.header {
  border-bottom: 1px solid rgba(0,0,0,0.18);
}

.delete-action-btn {
  align-self: auto;
}

.content {
  overflow:auto;
  padding: 0;
}

.content >>> .v-tabs {
  display: flex;
  flex-direction: column;
  max-height: 100%;
}

.content >>> .v-tabs .v-tabs-bar {
  margin: 0 16px;
  flex-shrink: 0;
}

.content >>> .v-tabs .v-tabs-items {
  flex: 1;
  overflow: auto;
  padding: 16px 24px;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}

.action-container {
  text-align: right;
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