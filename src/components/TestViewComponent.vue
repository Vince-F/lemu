<template>
  <v-card>
    <v-card-text>
      <v-tabs>
        <v-tab>
          Configuration
        </v-tab>
        <v-tab-item>
          <div class="pa-2 text-right">
            <v-btn color="primary" :disabled="testRunning"
              @click="runCurrentTest"
            >
              <v-icon>
                mdi-play
              </v-icon>
              Run this test
            </v-btn>
          </div>
          <form>
            <v-text-field label="label" :value="testContent.label" @input="updateField('label', $event)"></v-text-field>
            <v-text-field label="url" :value="testContent.url" @input="updateField('url', $event)"></v-text-field>
            <div class="d-flex" v-for="(additionnalField, index) in additionnalFields" :key="additionnalField.name">
              <v-text-field 
                v-if="additionnalField.type === 'number'" :label="additionnalField.name" 
                type="number" :value="additionnalField.value" :key="index" @input="updateField(additionnalField.name, Number.parseInt($event))"
                class="flex-grow-1 flex-shrink-1"></v-text-field>
              <v-checkbox v-else-if="additionnalField.type === 'boolean'" :label="additionnalField.name"
                :input-value="additionnalField.value"
                :key="index" @change="updateField(additionnalField.name, $event)"
                class="flex-grow-1 flex-shrink-1"></v-checkbox>
              <v-combobox v-else-if="additionnalField.type === 'array'" multiple chips
                :label="additionnalField.name" :value="additionnalField.value"
                :key="index" @change="updateField(additionnalField.name, $event)"
                class="flex-grow-1 flex-shrink-1"></v-combobox>
              <v-text-field 
                v-else :label="additionnalField.name" 
                :value="additionnalField.value" :key="index" @input="updateField(additionnalField.name, $event)"
                class="flex-grow-1 flex-shrink-1"></v-text-field>
              <v-btn icon class="flex-grow-0 flex-shrink-0 input-action-btn" @click="removeField(additionnalField.name)">
                <v-icon color="grey">mdi-delete</v-icon>
              </v-btn>
            </div>
          </form>
          <v-btn color="primary" v-on:click="addNewField()">
            <v-icon>mdi-add</v-icon>
            Add new field
          </v-btn>
        </v-tab-item>
        <v-tab>
          Result
        </v-tab>
        <v-tab-item>
          <div class="pa-2 text-right">
            <v-btn color="green" :disabled="testRunning"
              @click="approveCurrentTest"
            >
              <v-icon>
                mdi-checkbox-marked-circle
              </v-icon>
              Approve this test
            </v-btn>
          </div>
          <div v-if="resultLoading" class="text-center pa-3">
            <v-progress-circular
              indeterminate
              color="primary"
              :size="100"
              :width="10"
            ></v-progress-circular>
            <div >
              Loading tests results...
            </div>
          </div>
          <v-expansion-panels multiple v-else>
            <v-expansion-panel v-for="result in testResult" :key="result.pair.viewportLabel">
              <v-expansion-panel-header>
                <div>
                  <strong>{{result.pair.viewportLabel}}</strong>
                  ({{result.status}})
                  <v-icon color="green" v-if="result.status === 'pass'">
                    mdi-check-circle
                  </v-icon>
                  <v-icon color="red" v-else>
                    mdi-alert
                  </v-icon>
                </div>
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                <hr class="panel-separator">
                <div class="d-flex">
                  <div class="flex-grow-1 flex-shrink-1 image-container">
                    <p><strong>Test</strong></p>
                    <ZoomableImageComponent :imgSrc="getTestImagePath(result)" />
                  </div>
                  <div class="flex-grow-1 flex-shrink-1 image-container">
                    <p><strong>Reference</strong></p>
                    <img :src="getReferenceImagePath(result)" />
                  </div>
                  <div class="flex-grow-1 flex-shrink-1 image-container" 
                    v-if="result.status === 'fail' && result.pair.diffImage">
                    <p><strong>Diff</strong></p>
                    <img :src="getDiffImagePath(result)" />
                  </div>
                  
                </div>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-tab-item>
      </v-tabs>
    </v-card-text>
  </v-card>
</template>

<style scoped >
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

  .input-action-btn {
    align-self: center;
  }
</style>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";
import { Action, Mutation, State, Getter } from "vuex-class";
import { BackstopTest } from '../models/backstopTest';
import { BackstopConfiguration } from '../models/backstopConfiguration';
import { FileService } from '../services/fileService';
import { BackstopTestResult } from '../models/backstopTestResult';
import { ModalService } from "../services/modalService";
import AddTestFieldModalComponent from "./AddTestFieldModalComponent.vue";
import ZoomableImageComponent from "./ZoomableImageComponent.vue";

@Component({
  name: "test-view-component",
  components: {
    ZoomableImageComponent
  }
})
export default class TestViewComponent extends Vue {
  @Mutation("configurationStore/setScenarioField")
  private setScenarioField!: (paylod: {scenarioIndex: number, field: string, value: any}) => void;
  @Mutation("configurationStore/removeScenarioField")
  private readonly removeScenarioField!: (payload: {index: number, fieldName: string}) => void;
  @State((state) => state.configurationStore.currentConfiguration)
  private readonly configuration!: BackstopConfiguration;
  @State((state) => state.configurationStore.configurationPath)
  private readonly path!: string;
  @State((state) => state.testResultStore.resultExpired)
  private readonly resultExpired!: boolean;
  @Getter("testResultStore/getTestByLabel")
  private readonly getTestByLabel!: (labelName: string) => BackstopTestResult[];
  @Action("testResultStore/retrieveTestsResult")
  private readonly retrieveTestsResult!: () => Promise<void>;
  @Getter("configurationStore/htmlReportDirectory")
  private readonly htmlReportDirectory!: string;
  @Action("configurationStore/approveTest")
  private readonly approveTest!: (testLabel: string) => Promise<void>;
  @Action("configurationStore/runTest")
  private readonly runTest!: (testLabel: string) => Promise<any>;
  @State((state) => state.configurationStore.testRunning)
  private readonly testRunning!: boolean;
  @Mutation("applicationStore/displaySnackbar")
  private readonly displaySnackbar!: (payload: {text: string, success: boolean}) => void;

  // private additionnalFieldsReference: Array<{text: string; value: { name: string; type: string }}>;
  // private additionnalFields: Array<{name: string, value: string | number, type: string}>;

  @Prop()
  private testContent!: BackstopTest;
  @Prop()
  private testIndex!: number;

  private resultLoading: boolean;

  constructor() {
    super(arguments);
    this.resultLoading = false;
  }

  public created() {
    this.resultLoading = true;
    this.retrieveTestsResult()
      .finally(() => {
        this.resultLoading = false;
      });
  }

  private get additionnalFields(): Array<{name: string, value: string | number | boolean, type: string}> {
    const result = [];
    for (const key in this.testContent) {
      if (key !== "label" && key !== "url") { // those are the two mandatory fields that are always here
        const entry = {} as any;
        entry.name = key;
        entry.value = this.testContent[key];
        if (Array.isArray(this.testContent[key])) {
          entry.type = 'array';
        } else {
          entry.type = typeof this.testContent[key];
        }
        result.push(entry);
      }
    }
    return result;
  }

  private get testResult() {
    return this.getTestByLabel(this.testContent.label);
  }

  @Watch('resultExpired')
  private updateTestResult() {
    this.resultLoading = true;
    this.retrieveTestsResult()
      .finally(() => {
        this.resultLoading = false;
      });
  }

  private addNewField() {
    ModalService.launchModal(AddTestFieldModalComponent)
      .then((newField: {name: string, value: any, type: string}) => {
        this.validateField(newField);
      });
  }

  private approveCurrentTest() {
    this.approveTest(this.testContent.label)
      .then(() => {
        this.displaySnackbar({text: "Test successfully approved", success: true});
      }).catch((err) => {
        this.displaySnackbar({text: "Fail to approve test, error: " + err, success: false});
      });
  }

  private getDiffImagePath(testResult: BackstopTestResult) {
    return FileService.resolvePath([this.htmlReportDirectory, testResult.pair.diffImage]);
  }

  private getReferenceImagePath(testResult: BackstopTestResult) {
    return FileService.resolvePath([this.htmlReportDirectory, testResult.pair.reference]);
  }

  private getTestImagePath(testResult: BackstopTestResult) {
    return FileService.resolvePath([this.htmlReportDirectory, testResult.pair.test]);
  }

  private removeField(fieldName: string) {
    ModalService.launchConfirmationModal()
      .then(() => {
        this.removeScenarioField({index: this.testIndex, fieldName});
      })
  }

  private updateField(field: string, value: any) {
    this.setScenarioField({scenarioIndex: this.testIndex, field, value});
  }

  private runCurrentTest() {
    this.runTest(this.testContent.label)
      .then(() => {
        this.displaySnackbar({text: "Test successfully run", success: true});
      }).catch((err) => {
        this.displaySnackbar({text: "Test failed, error: " + err, success: false});
      });
  }

  private validateField(newField: {name: string, value: any, type: string}) {
    if (newField.name !== null) {
      if (newField.type === 'number' && typeof newField.value === "string") {
        newField.value = Number.parseFloat(newField.value);
      }
      this.updateField(newField.name, newField.value);
    }
  }
}
</script>