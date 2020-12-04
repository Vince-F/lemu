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
          <engine-configuration-component :configuration="configuration" 
            @setConfigurationEngineOptionsField="setConfigurationEngineOptionsField"
            @updateField="updateField"/>
        </v-tab-item>

        <v-tab>Report</v-tab>
        <v-tab-item>
          <report-configuration-component :configuration="configuration" @updateReport="updateReport"
            @updatePathField="updatePathField" />
        </v-tab-item>

        <v-tab>Perfomance</v-tab>
        <v-tab-item>
          <performance-configuration-component :configuration="configuration" 
            @updateField="updateField"/>
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
</style>

<script lang="ts">
import { EngineScript } from '@/models/engineScript';
import { Vue, Component } from "vue-property-decorator";
import { State, Mutation, Getter, Action } from "vuex-class";
import { BackstopConfiguration } from "../../models/backstopConfiguration";
import ViewportsComponent from "../tests/ViewportsComponent.vue";
import ReportConfigurationComponent from "./ReportConfigurationComponent.vue";
import EngineConfigurationComponent from "./EngineConfigurationComponent.vue";
import PerfomanceConfigurationComponent from "./PerfomanceConfigurationComponent.vue";

@Component({
  name: "general-configuration-component",
  components: {
    ViewportsComponent,
    ReportConfigurationComponent,
    EngineConfigurationComponent,
    PerfomanceConfigurationComponent
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