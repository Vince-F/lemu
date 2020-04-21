<template>
  <div>
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
  </div>
</template>

<style scoped>
.input-action-btn {
  align-self: center;
}
</style>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Action, Mutation, State, Getter } from "vuex-class";
import { ModalService } from "../../services/modalService";
import { BackstopTest } from '../../models/backstopTest';
import AddTestFieldModalComponent from "./AddTestFieldModalComponent.vue";

@Component({})
export default class TestConfigurationComponent extends Vue {
  @State((state) => state.testRunnerStore.testRunning)
  private readonly testRunning!: boolean;
  @Action("testRunnerStore/runTest")
  private readonly runTest!: (testLabel: string) => Promise<any>;
  @Mutation("configurationStore/setScenarioField")
  private setScenarioField!: (paylod: {scenarioIndex: number, field: string, value: any}) => void;
  @Mutation("configurationStore/removeScenarioField")
  private readonly removeScenarioField!: (payload: {index: number, fieldName: string}) => void;
  @Mutation("applicationStore/displaySnackbar")
  private readonly displaySnackbar!: (payload: {text: string, success: boolean}) => void;

  @Prop({required: true, type: BackstopTest})
  private readonly testContent!: BackstopTest;
  @Prop({required: true, type: Number})
  private readonly testIndex!: number;

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
    ModalService.launchModal(AddTestFieldModalComponent)
      .then((newField: {name: string, value: any, type: string}) => {
        this.validateField(newField);
      });
  }

  private removeField(fieldName: string) {
    ModalService.launchConfirmationModal()
      .then(() => {
        this.removeScenarioField({index: this.testIndex, fieldName});
      });
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

  private updateField(field: string, value: any) {
    this.setScenarioField({scenarioIndex: this.testIndex, field, value});
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