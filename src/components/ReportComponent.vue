<template>
  <div class="d-flex flex-column fill-height">
    <div class="flex-grow-0 flex-shrink-0 pa-2 text-right">
      <v-btn color="green" @click="approveTestsResult" :disabled="testRunning">
        <v-icon>
          mdi-checkbox-marked-circle
        </v-icon>
        Approve tests
      </v-btn>
    </div>
    <div v-if="!testRunning" class="flex-grow-1 flex-shrink-1">
      <iframe ref="reportFrame" v-if="reportPath && reportPath.length > 0" :src="reportPath">
      </iframe>
    </div>
    <div v-if="testRunning" class="text-center pa-3">
      <v-progress-circular
        indeterminate
        color="primary"
        :size="100"
        :width="10"
      ></v-progress-circular>
      <div >
        Tests are running...
      </div>
    </div>

    <v-snackbar v-model="snackbarDisplayed">
      <v-icon color="green" v-if="snackbarSuccess">
        mdi-check-circle
      </v-icon>
      <v-icon color="red" v-else>
        mdi-alert
      </v-icon>
      {{ snackbarText }}
      <v-btn
        color="white"
        text
        @click="snackbarDisplayed = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </div>
  
</template>

<style scoped>
  iframe {
    height: 98%;
    width: 100%;
    border: 0;
  }
</style>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Action, State } from "vuex-class";
import { BackstopConfiguration } from '../models/backstopConfiguration';
import { FileService } from '../services/fileService';

@Component
export default class ReportComponent extends Vue {
  @State((state) => state.configurationStore.currentConfiguration)
  private readonly configuration!: BackstopConfiguration;
  @State((state) => state.configurationStore.configurationPath)
  private readonly path!: string;
  @State((state) => state.configurationStore.testRunning)
  private readonly testRunning!: boolean;
  @Action("configurationStore/approveTests")
  private readonly approveTests!: () => Promise<any>; 

  private snackbarDisplayed: boolean;
  private snackbarText: string;
  private snackbarSuccess: boolean;

  constructor() {
    super(arguments);
    this.snackbarDisplayed = false;
    this.snackbarText = "";
    this.snackbarSuccess = false;
  }

  private get reportPath() {
    const configurationPath = this.configuration && this.configuration.paths && 
        this.configuration.paths.html_report || "";
    const prefixPath = this.path.substr(0, this.path.length - "backstop.json".length);
    return configurationPath &&
          FileService.resolvePath([prefixPath, configurationPath, "index.html"]) || "";
  }

  private approveTestsResult() {
    this.approveTests()
      .then(() => {
        this.snackbarDisplayed = true;
        this.snackbarText = "Tests successfully approved.";
        this.snackbarSuccess = true;
        const reportFrame = this.$refs.reportFrame;
        if (reportFrame instanceof HTMLIFrameElement && reportFrame
          && reportFrame.contentWindow) {
          reportFrame.contentWindow.location.reload(true);
        }
      }).catch((error) => {
        this.snackbarDisplayed = true;
        this.snackbarText = "Test approval failed. Error: " + error;
        this.snackbarSuccess = false;
      });
  }
}
</script>