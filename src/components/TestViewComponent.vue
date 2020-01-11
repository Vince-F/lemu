<template>
  <v-card>
    <v-card-text>
      <v-tabs>
        <v-tab>
          Configuration
        </v-tab>
        <v-tab-item>
          <form>
            <v-text-field label="label" :value="testContent.label" @input="updateField('label', $event)"></v-text-field>
            <v-text-field label="url" :value="testContent.url" @input="updateField('url', $event)"></v-text-field>
            <template v-for="(additionnalField, index) in additionnalFields">
              <v-text-field 
                v-if="additionnalField.type === 'number'" :label="additionnalField.name" 
                type="number" :value="additionnalField.value" :key="index" @input="updateField(additionnalField.name, Number.parseInt($event))"
                ></v-text-field>
              <v-checkbox v-else-if="additionnalField.type === 'boolean'" :label="additionnalField.name"
                :input-value="additionnalField.value"
                :key="index" @change="updateField(additionnalField.name, $event)"
                ></v-checkbox>
              <v-combobox v-else-if="additionnalField.type === 'array'" multiple chips
                :label="additionnalField.name" :value="additionnalField.value"
                :key="index" @change="updateField(additionnalField.name, $event)"
                ></v-combobox>
              <v-text-field 
                v-else :label="additionnalField.name" 
                :value="additionnalField.value" :key="index" @input="updateField(additionnalField.name, $event)"
                ></v-text-field>
            </template>
          </form>
          <v-btn v-show="!addingNewField" color="primary" v-on:click="addNewField()">
            <v-icon>mdi-add</v-icon>
            Add new field
          </v-btn>
          <v-card v-if="addingNewField" elevation="4">
            <v-card-title>Add new field</v-card-title>
            <v-card-text class="align-self-stretch">
              <div>
                <v-text-field class="ma-2"
                  label="Field name"
                  v-model="newFieldName"></v-text-field>
                <!--
                <v-combobox
                  class="ma-2"
                  v-model="newFieldName"
                  :items="additionnalFieldsReference"
                  label="Field name"
                ></v-combobox> -->
              </div>
              <div class="d-flex">
                <v-select
                  class="ma-2"
                  :items="types"
                  label="Type"
                  v-model="newFieldType"
                  @change="updateNewValueType"
                ></v-select>
                <v-text-field class="ma-2"
                  v-if="newFieldType === 'number'" label="Value" 
                  type="number" v-model="newFieldValue"
                  ></v-text-field>
                <v-checkbox class="ma-2" v-else-if="newFieldType === 'boolean'" label="Value"
                  v-model="newFieldValue"
                  ></v-checkbox>
                <v-combobox class="ma-2" v-else-if="newFieldType === 'array'" multiple chips
                  label="Value" v-model="newFieldValue"
                  ></v-combobox>
                <v-text-field class="ma-2"
                  v-else label="Value" v-model="newFieldValue"
                  ></v-text-field>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" v-on:click="validateField()">
                <v-icon>mdi-check</v-icon>
                Validate field
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-tab-item>
        <v-tab>
          Result
        </v-tab>
        <v-tab-item>
          <v-expansion-panels multiple>
          <v-expansion-panel v-for="result in testResult" :key="result.pair.viewportLabel">
              <v-expansion-panel-header >
                {{result.pair.viewportLabel}}
                ({{result.status}})
              </v-expansion-panel-header>
              <v-expansion-panel-content>
                Images goes here!
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-tab-item>
      </v-tabs>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Action, Mutation, State, Getter } from "vuex-class";
import { BackstopTest } from '../models/backstopTest';
import { BackstopConfiguration } from '../models/backstopConfiguration';
import { FileService } from '../services/fileService';
import { BackstopTestResult } from '../models/backstopTestResult';

@Component({
  name: "test-view-component"
})
export default class TestViewComponent extends Vue {
  @Mutation("configurationStore/setScenarioField")
  private setScenarioField!: Function;
  @State((state) => state.configurationStore.currentConfiguration)
  private readonly configuration!: BackstopConfiguration;
  @State((state) => state.configurationStore.configurationPath)
  private readonly path!: string;
  @Getter("testResultStore/getTestByLabel")
  private readonly getTestByLabel!: (labelName: string) => BackstopTestResult[];
  @Action("testResultStore/retrieveTestsResult")
  private readonly retrieveTestsResult!: () => Promise<void>;

  private addingNewField: boolean;
  // private additionnalFieldsReference: Array<{text: string; value: { name: string; type: string }}>;
  // private additionnalFields: Array<{name: string, value: string | number, type: string}>;
  private newFieldName: string | null;
  private newFieldValue: number | boolean | string | string[];
  private newFieldType: string;
  private readonly types: string[];

  @Prop()
  private testContent!: BackstopTest;
  @Prop()
  private testIndex!: number;

  constructor() {
    super(arguments);
    this.addingNewField = false;
    this.newFieldName = null;
    this.newFieldValue = "";
    this.newFieldType = "string";
    this.types = ["number", "boolean", "array", "string"];
  }

  public created() {
    this.retrieveTestsResult()
      .then(() => {
        // announce stop of loading
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

  private addNewField() {
    this.addingNewField = true;
  }

  private get testResult() {
    return this.getTestByLabel(this.testContent.label);
  }

  private updateField(field: string, value: any) {
    this.setScenarioField({scenarioIndex: this.testIndex, field, value});
  }

  private updateNewValueType() {
    switch (this.newFieldType) {
      case 'array':
        this.newFieldValue = [];
        break;
      case 'boolean':
        this.newFieldValue = false;
        break;
      case 'number':
        this.newFieldValue = 0;
        break;
      default:
        this.newFieldValue = "";
        break;
    }
  }

  private validateField() {
    if (this.newFieldName !== null) {
      if (this.newFieldType === 'number' && typeof this.newFieldValue === "string") {
        this.newFieldValue = Number.parseFloat(this.newFieldValue);
      }
      this.updateField(this.newFieldName, this.newFieldValue);
      this.newFieldName = null;
      this.newFieldValue = "";
      this.newFieldType = "string";
      this.addingNewField = false;
    }
  }
}
</script>