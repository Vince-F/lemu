<template>
  <v-card class="card" v-if="testContent">
    <v-card-title class="header flex-grow-0 flex-shrink-0">
      <div class="flex-grow-1 flex-shrink-1">
        {{testContent.label}} 
        <v-icon color="green" v-if="testStatus === 'pass'">
          mdi-check-circle
        </v-icon>
        <v-icon color="grey" v-else-if="testStatus === 'unknown'">
          mdi-help-circle 
        </v-icon>
        <v-icon color="red" v-else>
          mdi-alert
        </v-icon>
      </div>
      <div class="flex-grow-0 flex-shrink-0">
        <v-btn icon :disabled="testRunning" @click="runCurrentTest">
          <v-icon>
            mdi-play
          </v-icon>
        </v-btn>
        <v-btn icon :disabled="testRunning" @click="approveCurrentTest">
          <v-icon>
            mdi-check-circle
          </v-icon>
        </v-btn>
        <v-btn icon :disabled="testRunning" @click="duplicateTest">
          <v-icon>
            mdi-content-copy
          </v-icon>
        </v-btn>
        <v-btn icon :disabled="testRunning" @click="deleteTest">
          <v-icon>
            mdi-delete
          </v-icon>
        </v-btn>
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
          Result
        </v-tab>
        <v-tab-item>
          <test-result-component :testContent="testContent" :resultLoading="resultLoading"
            :testResult="testResult" />
        </v-tab-item>
      </v-tabs>
    </v-card-text>
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
}
</style>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Action, Mutation, State, Getter } from "vuex-class";
import { BackstopTest } from '../../models/backstopTest';
import { BackstopConfiguration } from '../../models/backstopConfiguration';
import { BackstopTestResult } from '../../models/backstopTestResult';
import { ModalService } from "../../services/modalService";
import TestConfigurationComponent from "./TestConfigurationComponent.vue";
import TestResultComponent from "./TestResultComponent.vue";

@Component({
  name: "test-view-component",
  components: {
    TestConfigurationComponent,
    TestResultComponent
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
  private readonly runTest!: (testLabel: string) => Promise<any>;
  @State((state) => state.testRunnerStore.testRunning)
  private readonly testRunning!: boolean;
  @Action("testResultStore/retrieveTestsResult")
  private readonly retrieveTestsResult!: () => Promise<void>;
  @Getter("testResultStore/getTestByLabel")
  private readonly getTestByLabel!: (labelName: string) => BackstopTestResult[];
  @Mutation("applicationStore/displaySnackbar")
  private readonly displaySnackbar!: (payload: {text: string, success: boolean}) => void;
  @Mutation("configurationStore/removeScenario")
  private readonly removeScenario!: (index: number) => void;
  @Mutation("configurationStore/duplicateScenario")
  private readonly duplicateScenario!: (index: number) => void;

  private testContent: BackstopTest | null;
  private testIndex: number;
  private resultLoading: boolean;

  constructor() {
    super(arguments);
    this.resultLoading = false;
    this.testContent = null;
    this.testIndex = -1;
  }

  private get testResult() {
    return this.getTestByLabel(this.testContent?.label || "");
  }

  private get testStatus() {
    let status = 'unknown';
    this.testResult.forEach((result) => {
      if (result.status === "pass" && status === "unknown") {
        status = "pass";
      } else if (result.status !== "pass") {
        status = 'failed';
      }
    });
    return status;
  }

  public created() {
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
          this.displaySnackbar({text: "Test successfully approved", success: true});
        }).catch((err) => {
          this.displaySnackbar({text: "Fail to approve test, error: " + err, success: false});
        });
    }
  }

  private deleteTest() {
    ModalService.launchConfirmationModal()
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
          this.displaySnackbar({text: "Test successfully run", success: true});
        }).catch((err) => {
          this.displaySnackbar({text: "Test failed, error: " + err, success: false});
        });
    }
  }

  @Watch('resultExpired')
  private updateTestResult() {
    this.resultLoading = true;
    this.retrieveTestsResult()
      .finally(() => {
        this.resultLoading = false;
      });
  }
}
</script>