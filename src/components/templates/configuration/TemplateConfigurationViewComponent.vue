<template>
  <v-card outlined height="100%" max-height="100%" class="card">
    <v-card-title class="header flex-grow-0 flex-shrink-0">
      <v-toolbar flat color="primary" dark>
        <v-toolbar-title>{{configuration.id}}</v-toolbar-title>
      </v-toolbar>
    </v-card-title>
    <v-card-text class="content flex-grow-1 flex-shrink-1">
      <v-tabs>
        <v-tab>General</v-tab>
        <v-tab-item>
          <general-configuration-component :configuration="configuration"
            @updateField="updateField" @updatePathField="updatePathField" />
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
import { BackstopConfiguration } from "../../../models/backstopConfiguration";
import { ModalService } from "../../../services/modalService";
import ViewportsComponent from "../tests/ViewportsComponent.vue";
import ReportConfigurationComponent from "./ReportConfigurationComponent.vue";
import EngineConfigurationComponent from "./EngineConfigurationComponent.vue";
import PerfomanceConfigurationComponent from "./PerfomanceConfigurationComponent.vue";
import GeneralConfigurationComponent from "./GeneralConfigurationComponent.vue";

@Component({
  name: "configuration-component",
  components: {
    ViewportsComponent,
    ReportConfigurationComponent,
    EngineConfigurationComponent,
    PerfomanceConfigurationComponent,
    GeneralConfigurationComponent
  }
})
export default class ConfigurationComponent extends Vue {
  @State((state) => state.configurationStore.currentConfiguration)
  private readonly configuration!: BackstopConfiguration;
  @Mutation("templateStore/addViewportInConfiguration")
  private readonly addViewportInConfig!: (configIdx: number) => void;
  @Mutation("configurationStore/removeViewportInConfiguration")
  private readonly removeViewportInConfig!: (configIdx: number, viewportId: number) => void;
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
  @Action("engineScriptStore/retrieveEngineScripts")
  private readonly retrieveEngineScripts!: () => Promise<void>;

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