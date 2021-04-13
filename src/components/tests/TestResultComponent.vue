<template>
  <div class="d-flex result-container">
    <div v-if="testResult.length > 0" class="pa-2 text-right flex-shrink-0 flex-grow-0">
      <v-btn @click="togglePanels">
        <template v-if="openedPanel.length === 0">Open all</template>
        <template v-else>Close all</template>
      </v-btn>
      <v-btn color="green" :disabled="testRunning" @click="approveCurrentTest">
        <v-icon> mdi-checkbox-marked-circle </v-icon>
        Approve this test
      </v-btn>
    </div>
    <div class="flex-grow-1 flex-shrink-1 pa-2">
      <div v-if="resultLoading" class="text-center pa-3">
        <v-progress-circular
          indeterminate
          color="primary"
          :size="100"
          :width="10"
        ></v-progress-circular>
        <div>Loading tests results...</div>
      </div>
      <div v-if="testResult.length === 0">No test result found.</div>
      <v-expansion-panels multiple v-model="openedPanel" v-else>
        <v-expansion-panel
          v-for="result in testResult"
          :key="result.pair.viewportLabel"
        >
          <v-expansion-panel-header>
            <div>
              <strong>{{ result.pair.viewportLabel }}</strong>
              ({{ result.status }})
              <v-icon class="icon-offset" color="green" v-if="result.status === 'pass'">
                mdi-check-circle
              </v-icon>
              <v-icon class="icon-offset" color="red" v-else> mdi-alert </v-icon>
            </div>
            <v-spacer></v-spacer>
            <v-btn
              color="green"
              text
              :disabled="testRunning"
              class="flex-grow-0 flex-shrink-0"
              @click.stop.prevent="
                approveCurrentTestWithViewport(result.pair.viewportLabel)
              "
            >
              <v-icon> mdi-checkbox-marked-circle </v-icon>
              Approve this viewport
            </v-btn>
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <hr class="panel-separator" />
            <div class="d-flex">
              <div class="flex-grow-1 flex-shrink-1 image-container">
                <p><strong>Reference</strong></p>
                <ZoomableImageComponent :imgSrc="getReferenceImagePath(result)" />
              </div>
              <div class="flex-grow-1 flex-shrink-1 image-container">
                <p><strong>Test</strong></p>
                <ZoomableImageComponent :imgSrc="getTestImagePath(result)" />
              </div>
              <div
                class="flex-grow-1 flex-shrink-1 image-container"
                v-if="result.status === 'fail' && result.pair.diffImage"
              >
                <p><strong>Diff</strong></p>
                <ZoomableImageComponent :imgSrc="getDiffImagePath(result)" />
              </div>
            </div>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </div>
  </div>
</template>

<style scoped>
.result-container {
  flex-direction: column;
}

.image-container {
  flex-basis: 0;
}

.image-container img {
  max-width: 90%;
}

.panel-separator {
  margin-left: -24px;
  margin-right: -24px;
  margin-bottom: 24px;
}

.v-btn + .v-btn {
  margin-left: 8px;
}

.icon-offset {
  top: -2px;
}
</style>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { State, Action, Getter } from "vuex-class";
import { FileService } from "../../services/fileService";
import { BackstopTest } from "../../models/backstopTest";
import { BackstopTestResult } from "../../models/backstopTestResult";
import ZoomableImageComponent from "./ZoomableImageComponent.vue";

@Component({
  components: {
    ZoomableImageComponent
  }
})
export default class TestResultComponent extends Vue {
  @State((state) => state.testRunnerStore.testRunning)
  private readonly testRunning!: boolean;

  @Action("configurationStore/approveTest")
  private readonly approveTest!: (testLabel: string) => Promise<void>;

  @Action("configurationStore/approveTestViewport")
  private readonly approveTestViewport!: (payload: {
    testLabel: string;
    viewportLabel: string;
  }) => Promise<void>;

  @Getter("configurationStore/htmlReportDirectory")
  private readonly htmlReportDirectory!: string;

  @Action("applicationStore/displaySnackbar")
  private readonly displaySnackbar!: (payload: {
    text: string;
    success: boolean;
  }) => void;

  @Prop({ required: true, type: BackstopTest })
  private readonly testContent!: BackstopTest;

  @Prop({ required: true, type: Boolean })
  private readonly resultLoading!: boolean;

  @Prop({ required: true, type: Array })
  private readonly testResult!: BackstopTestResult[];

  private openedPanel: number[];

  constructor() {
    super(arguments);
    this.openedPanel = [];
  }

  private approveCurrentTest() {
    if (this.testContent) {
      this.approveTest(this.testContent.label)
        .then(() => {
          this.displaySnackbar({
            text: "Test successfully approved",
            success: true
          });
        })
        .catch((err) => {
          this.displaySnackbar({
            text: "Fail to approve test, error: " + err,
            success: false
          });
        });
    }
  }

  private approveCurrentTestWithViewport(viewportLabel: string) {
    if (this.testContent) {
      this.approveTestViewport({
        testLabel: this.testContent.label,
        viewportLabel
      })
        .then(() => {
          this.displaySnackbar({
            text: "Test successfully approved",
            success: true
          });
        })
        .catch((err) => {
          this.displaySnackbar({
            text: "Fail to approve test, error: " + err,
            success: false
          });
        });
    }
  }

  private getDiffImagePath(testResult: BackstopTestResult) {
    return FileService.resolvePath([
      this.htmlReportDirectory,
      testResult.pair.diffImage
    ]);
  }

  private getReferenceImagePath(testResult: BackstopTestResult) {
    return FileService.resolvePath([
      this.htmlReportDirectory,
      testResult.pair.reference
    ]);
  }

  private getTestImagePath(testResult: BackstopTestResult) {
    return FileService.resolvePath([
      this.htmlReportDirectory,
      testResult.pair.test
    ]);
  }

  private togglePanels() {
    if (this.openedPanel.length > 0) {
      this.openedPanel = [];
    } else {
      this.openedPanel = this.testResult.map((value, idx) => idx);
    }
  }
}
</script>
