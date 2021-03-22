<template>
  <v-card outlined height="100%" max-height="100%" class="card" v-if="currentConfiguration">
    <v-card-title class="header flex-grow-0 flex-shrink-0">
      <div class="flex-grow-1 flex-shrink-1">
        {{currentConfiguration.id}}
      </div>
      <div class="flex-grow-0 flex-shrink-0">
        <entity-menu-bar-action-component iconName="mdi-delete" tooltipContent="Delete"
          @click="deleteConfiguration" />
      </div>
    </v-card-title>
    <v-card-text class="content flex-grow-1 flex-shrink-1">
      <v-tabs>
        <v-tab>General</v-tab>
        <v-tab-item>
          <general-configuration-component templateView :configuration="currentConfiguration"
            @updateField="updateField" @updatePathField="updatePathField" />
        </v-tab-item>

        <v-tab>Viewports ({{currentConfiguration.viewports.length || 0}})</v-tab>
        <v-tab-item>
          <viewports-component :viewports="currentConfiguration.viewports" @addViewport="addViewport"
            @removeViewport="removeViewport" @updateViewportField="updateViewportField"/>
        </v-tab-item>

        <v-tab>Engine</v-tab>
        <v-tab-item>
          <engine-configuration-component :configuration="currentConfiguration" 
            @setConfigurationEngineOptionsField="setConfigurationEngineOptionsField"
            @updateField="updateField"/>
        </v-tab-item>

        <v-tab>Report</v-tab>
        <v-tab-item>
          <report-configuration-component :configuration="currentConfiguration" @updateReport="updateReport"
            @updatePathField="updatePathField" />
        </v-tab-item>

        <v-tab>Perfomance</v-tab>
        <v-tab-item>
          <performance-configuration-component :configuration="currentConfiguration" 
            @updateField="updateField"/>
        </v-tab-item>
      </v-tabs>
    </v-card-text>
  </v-card>
  <v-card class="card" v-else>
    <v-card-text>
      This configuration doesn't exist
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
import { Vue, Component, Watch } from "vue-property-decorator";
import { State, Mutation } from "vuex-class";
import { BackstopConfiguration } from "../../../models/backstopConfiguration";
import { ModalService } from "../../../services/modalService";
import ViewportsComponent from "../../tests/ViewportsComponent.vue";
import ReportConfigurationComponent from "../../generalConfig/ReportConfigurationComponent.vue";
import EngineConfigurationComponent from "../../generalConfig/EngineConfigurationComponent.vue";
import PerformanceConfigurationComponent from "../../generalConfig/PerformanceConfigurationComponent.vue";
import GeneralConfigurationComponent from "../../generalConfig/GeneralConfigurationComponent.vue";
import EntityMenuBarActionComponent from "../../layout/EntityMenuBarActionComponent.vue";

@Component({
  name: "configuration-component",
  components: {
    ViewportsComponent,
    ReportConfigurationComponent,
    EngineConfigurationComponent,
    PerformanceConfigurationComponent,
    GeneralConfigurationComponent,
    EntityMenuBarActionComponent
  }
})
export default class ConfigurationComponent extends Vue {
  @State((state) => state.templateStore.configurationTemplates)
  private readonly configurationTemplates!: BackstopConfiguration[];
  @Mutation("templateStore/addViewportInConfiguration")
  private readonly addViewportInConfig!: (configIdx: number) => void;
  @Mutation("templateStore/removeViewportInConfiguration")
  private readonly removeViewportInConfig!: (payload: {configIdx: number, viewportId: number}) => void;
  @Mutation("templateStore/setFieldInConfiguration")
  private readonly setConfigurationField!: (payload: {configIdx: number, field: string, value: any}) => void;
  @Mutation("templateStore/setPathFieldInConfiguration")
  private readonly setConfigurationPathField!: (payload: {configIdx: number, field: string, value: any}) => void;
  @Mutation("templateStore/setReportInConfiguration")
  private readonly setConfigurationReport!: (payload: {configIdx: number, reportType: string, kept: boolean}) => void;
  @Mutation("templateStore/setViewportFieldInConfiguration")
  private readonly setConfigurationViewportField!:
    (payload: {configIdx: number, viewportIndex: number, field: string, value: any}) => void;
  @Mutation("templateStore/setEngineOptionInConfiguration")
  private readonly setConfigurationEngineOptionsField!: (payload: {configIdx: number,
    field: string, value: any}) => void;
  @Mutation("templateStore/removeEngineOptionInConfiguration")
  private readonly removeEngineOption!: (fieldName: string) => void;
  @Mutation("templateStore/removeConfigurationTemplate")
  private readonly removeConfigurationTemplate!: (index: number) => void;

  private currentIndex: number;
  private currentConfiguration: BackstopConfiguration | null;

  constructor() {
    super(arguments);
    this.currentConfiguration = null;
    this.currentIndex = -1;
  }


  private addViewport() {
    this.addViewportInConfig(this.currentIndex);
  }

  private confirmEngineOptionRemove(fieldName: string) {
    ModalService.launchConfirmationModal("Do you really wish to delete this entry?")
      .then(() => {
        this.removeEngineOption(fieldName);
      });
  }

  @Watch("$route", { immediate: true })
  private loadTemplateConfiguraion() {
    const index = Number(this.$route.params.index);
    if (index >= 0) {
      this.currentIndex = index;
      this.currentConfiguration = this.configurationTemplates[index] ?? null;
    }
  }

  private removeViewport(index: number) {
    this.removeViewportInConfig({configIdx: this.currentIndex, viewportId: index});
  }

  private updateField(field: string, value: any) {
    this.setConfigurationField({configIdx: this.currentIndex, field, value});
  }

  private updatePathField(field: string, value: any) {
    this.setConfigurationPathField({configIdx: this.currentIndex, field, value});
  }

  private updateReport(reportType: string, kept: boolean) {
    this.setConfigurationReport({configIdx: this.currentIndex, reportType, kept});
  }

  private updateViewportField(viewportIndex: number, field: string, value: any) {
    this.setConfigurationViewportField({configIdx: this.currentIndex, viewportIndex, field, value});
  }

  private deleteConfiguration() {
    this.removeConfigurationTemplate(this.currentIndex);
    this.$router.push({name: "configurationTemplates.welcome"});
  }
}
</script>