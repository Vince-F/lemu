<template>
  <v-card class="card" v-if="testContent"
    @contextmenu="showContextMenu">
    <v-card-title class="header flex-grow-0 flex-shrink-0">
      <div class="flex-grow-1 flex-shrink-1">
        {{testContent.label}}
        <v-tooltip top>
          <template v-slot:activator="{ on }">
            <v-icon v-on="on" color="green" class="icon-offset" v-if="testStatus === 'pass'">
              mdi-check-circle
            </v-icon>
            <v-icon v-on="on" color="grey" class="icon-offset" v-else-if="testStatus === 'unknown'">
              mdi-help-circle
            </v-icon>
            <v-icon v-on="on" color="red" class="icon-offset" v-else>
              mdi-alert
            </v-icon>
          </template>
          <template v-if="testStatus === 'pass'">Test passed successfully</template>
          <template v-else-if="testStatus === 'unknown'">Test status unknown</template>
          <template v-else>Test failed</template>
        </v-tooltip>
      </div>
      <div class="flex-grow-0 flex-shrink-0">
        <entity-menu-bar-action-component :iconName="isFullscreen ? 'mdi-fullscreen-exit' : 'mdi-fullscreen'"
          tooltipContent="Toggle fullscreen" @click="toggleFullscreen" />
        <entity-menu-bar-action-component iconName="mdi-play" tooltipContent="Run this test"
          :disabled="testRunning" @click="runCurrentTest" />
        <entity-menu-bar-action-component iconName="mdi-check-circle" tooltipContent="Approve this test"
          :disabled="testRunning" @click="approveCurrentTest"/>
        <entity-menu-bar-action-component iconName="mdi-content-copy" tooltipContent="Duplicate"
          :disabled="testRunning" @click="duplicateTest"/>
        <entity-menu-bar-action-component iconName="mdi-delete" tooltipContent="Delete this test"
          :disabled="testRunning" @click="deleteTest"/>
      </div>
    </v-card-title>
    <v-card-text class="content flex-grow-1 flex-shrink-1">
      <v-tabs>
        <v-tab>
          Configuration
        </v-tab>
        <v-tab-item>
          <test-configuration-component :testContent="testContent" :testIndex="testIndex"/>
        </v-tab-item>
        <v-tab>
          Preview
        </v-tab>
        <v-tab-item>
          <test-preview-component :testContent="testContent" />
        </v-tab-item>
        <v-tab>
          Result
        </v-tab>
        <v-tab-item>
          <test-result-component :testContent="testContent" :resultLoading="resultLoading"
            :testResult="testResult" />
        </v-tab-item>
      </v-tabs>
    </v-card-text>
    <v-menu offset-y absolute v-model="contextMenuDisplayed"
      :position-x="contextMenuX" :position-y="contextMenuY"
      >
      <v-list dense>
        <v-list-item>
          <v-list-item-title @click="toggleFullscreen">
            <v-icon v-if="isFullscreen">
              mdi-fullscreen-exit
            </v-icon>
            <v-icon v-else>
              mdi-fullscreen
            </v-icon>
            Toggle fullscreen
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title :disabled="testRunning" @click="runCurrentTest">
            <v-icon color="grey lighten-1">mdi-play</v-icon>
            Run this test
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title :disabled="testRunning" @click="approveCurrentTest">
            <v-icon color="grey lighten-1">mdi-check-circle</v-icon>
            Approve this test
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title @click="duplicateTest">
            <v-icon color="grey lighten-1">mdi-content-copy</v-icon>
            Duplicate
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title :disabled="testRunning" @click="deleteTest">
            <v-icon color="grey lighten-1">mdi-delete</v-icon>
            Delete
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-card>
  <v-card class="card" v-else>
    <v-card-text>
      This test doesn't exist
    </v-card-text>
  </v-card>
</template>

<style scoped >
.card {
  display: flex;
  flex-direction: column;
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
  padding: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}

.icon-offset {
  top: -2px;
}
</style>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { Action, Mutation, State, Getter } from "vuex-class";
import { BackstopTest } from "../../models/backstopTest";
import { BackstopConfiguration } from "../../models/backstopConfiguration";
import { BackstopTestResult } from "../../models/backstopTestResult";
import { ModalService } from "../../services/modalService";
import TestConfigurationComponent from "./TestConfigurationComponent.vue";
import TestPreviewComponent from "./TestPreviewComponent.vue";
import TestResultComponent from "./TestResultComponent.vue";
import EntityMenuBarActionComponent from "../layout/EntityMenuBarActionComponent.vue";

@Component({
  name: "test-view-component",
  components: {
    TestConfigurationComponent,
    TestPreviewComponent,
    TestResultComponent,
    EntityMenuBarActionComponent
  }
})
export default class TestViewComponent extends Vue {
  @State((state) => state.configurationStore.currentConfiguration)
  private readonly configuration!: BackstopConfiguration;

  @State((state) => state.configurationStore.configurationPath)
  private readonly path!: string;

  @State((state) => state.testResultStore.resultExpired)
  private readonly resultExpired!: boolean;

  @Action("configurationStore/approveTest")
  private readonly approveTest!: (testLabel: string) => Promise<void>;

  @Action("testRunnerStore/runTest")
  private readonly runTest!: (testLabel: string) => Promise<void>;

  @State((state) => state.testRunnerStore.testRunning)
  private readonly testRunning!: boolean;

  @Action("testResultStore/retrieveTestsResult")
  private readonly retrieveTestsResult!: () => Promise<void>;

  @Getter("testResultStore/getResultByTestLabel")
  private readonly getResultByTestLabel!: (labelName: string) => BackstopTestResult[];

  @Action("applicationStore/displaySnackbar")
  private readonly displaySnackbar!: (payload: {text: string, success: boolean}) => void;

  @Mutation("configurationStore/removeScenario")
  private readonly removeScenario!: (index: number) => void;

  @Mutation("configurationStore/duplicateScenario")
  private readonly duplicateScenario!: (index: number) => void;

  private testContent: BackstopTest | null;
  private testIndex: number;
  private resultLoading: boolean;
  private contextMenuDisplayed: boolean;
  private contextMenuX: number;
  private contextMenuY: number;

  constructor() {
    super(arguments);
    this.resultLoading = false;
    this.testContent = null;
    this.testIndex = -1;
    this.contextMenuDisplayed = false;
    this.contextMenuX = -1;
    this.contextMenuY = -1;
  }

  private get isFullscreen(): boolean {
    return this.$route.name === "test.fullscreenView";
  }

  private get testResult(): BackstopTestResult[] {
    return this.getResultByTestLabel(this.testContent?.label || "");
  }

  private get testStatus(): "unknown" | "pass" | "failed" {
    let status: "unknown" | "pass" | "failed" = "unknown";
    this.testResult.forEach((result) => {
      if (result.status === "pass" && status === "unknown") {
        status = "pass";
      } else if (result.status !== "pass") {
        status = "failed";
      }
    });
    return status;
  }

  public created(): void {
    this.loadTest();
  }

  private loadTest() {
    this.testIndex = Number.parseInt(this.$route.params.index, 10);
    this.testContent = this.configuration.scenarios[this.testIndex];
    this.resultLoading = true;
    this.retrieveTestsResult()
      .finally(() => {
        this.resultLoading = false;
      });
  }

  @Watch("$route")
  private updateTest() {
    this.loadTest();
  }

  private approveCurrentTest() {
    if (this.testContent) {
      this.approveTest(this.testContent.label)
        .then(() => {
          this.displaySnackbar({ text: "Test successfully approved", success: true });
        }).catch((err) => {
          this.displaySnackbar({ text: "Fail to approve test, error: " + err, success: false });
        });
    }
  }

  private deleteTest() {
    ModalService.launchConfirmationModal("Do you really wish to delete this entry?")
      .then(() => {
        this.removeScenario(this.testIndex);
        this.$router.push("/tests/list");
      });
  }

  private duplicateTest() {
    this.duplicateScenario(this.testIndex);
  }

  private runCurrentTest() {
    if (this.testContent) {
      this.runTest(this.testContent.label)
        .then(() => {
          this.displaySnackbar({ text: "Test successfully run", success: true });
        }).catch((err) => {
          this.displaySnackbar({ text: "Test failed, error: " + err, success: false });
        });
    }
  }

  private showContextMenu($event: MouseEvent) {
    $event.preventDefault();
    this.contextMenuDisplayed = true;
    this.contextMenuY = $event.clientY;
    this.contextMenuX = $event.clientX;
  }

  private toggleFullscreen() {
    if (this.$route.name === "test.fullscreenView") {
      this.$router.push({ name: "tests.view", params: { index: "" + this.testIndex } });
    } else {
      this.$router.push({ name: "test.fullscreenView", params: { index: "" + this.testIndex } });
    }
  }

  @Watch("resultExpired")
  private updateTestResult() {
    this.resultLoading = true;
    this.retrieveTestsResult()
      .finally(() => {
        this.resultLoading = false;
      });
  }
}
</script>
