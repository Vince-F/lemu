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
      <v-text-field outlined dense label="label" :value="testContent.label" @input="updateField('label', $event)"></v-text-field>
      <v-text-field outlined dense label="url" :value="testContent.url" @input="updateField('url', $event)"></v-text-field>
      <div class="d-flex" v-for="(additionnalField, index) in additionnalFields" :key="additionnalField.name">
        <v-text-field outlined dense
          v-if="additionnalField.type === 'number'" :label="additionnalField.name"
          type="number" :value="additionnalField.value" :key="index" @input="updateField(additionnalField.name, Number.parseInt($event))"
          class="flex-grow-1 flex-shrink-1"></v-text-field>
        <v-checkbox v-else-if="additionnalField.type === 'boolean'" :label="additionnalField.name"
          :input-value="additionnalField.value"
          :key="index" @change="updateField(additionnalField.name, $event)"
          class="flex-grow-1 flex-shrink-1"></v-checkbox>
        <v-combobox outlined dense v-else-if="additionnalField.type === 'array'" multiple
          :label="additionnalField.name" :value="additionnalField.value"
          :key="index" @change="updateField(additionnalField.name, $event)"
          class="flex-grow-1 flex-shrink-1"></v-combobox>
        <v-select outlined dense v-else-if="additionnalField.type === 'scripts'"
          :value="additionnalField.value" @input="updateField(additionnalField.name, $event)"
            :items="scriptNames" :label="additionnalField.name"></v-select>
        <div v-else-if="additionnalField.type === 'viewports'" class="viewports-area">
          <v-expansion-panels>
            <v-expansion-panel>
              <v-expansion-panel-header>Viewports</v-expansion-panel-header>
              <v-expansion-panel-content>
                <viewports-component
                  :viewports="additionnalField.value" @addViewport="addViewport(additionnalField.value)"
                  @removeViewport="removeViewport(additionnalField.value, arguments[0])"
                  @updateViewportField="updateViewportField(additionnalField.value, arguments[0], arguments[1], arguments[2])"/>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
        <v-text-field outlined dense
          v-else :label="additionnalField.name"
          :value="additionnalField.value" :key="index" @input="updateField(additionnalField.name, $event)"
          class="flex-grow-1 flex-shrink-1"></v-text-field>
        <v-tooltip top>
          <template v-slot:activator="{on}">
            <v-btn icon class="flex-grow-0 flex-shrink-0" :class="{'input-action-btn': additionnalField.type === 'boolean','for-viewport': additionnalField.type === 'viewports' }"
              v-on="on" v-if="getHelpMessage(additionnalField.name)">
              <v-icon color="grey">mdi-help-circle-outline</v-icon>
            </v-btn>
          </template>
          <span>{{getHelpMessage(additionnalField.name)}}</span>
        </v-tooltip>
        <v-btn icon class="flex-grow-0 flex-shrink-0" :class="{'input-action-btn': additionnalField.type === 'boolean', 'for-viewport': additionnalField.type === 'viewports'}" @click="removeField(additionnalField.name)">
          <v-icon color="grey">mdi-delete</v-icon>
        </v-btn>
      </div>
      <v-btn v-if="!testContent.actions" color="primary" v-on:click="enableActions()">
        Enable actions
      </v-btn>
      <test-actions-component v-else :test="testContent" :testIndex="testIndex" @actions-removed="removeField('actions')"/>
    </form>
    <div class="actions-area">
      <v-btn color="primary" v-on:click="addNewField()">
        <v-icon>mdi-plus</v-icon>
        Add new field
      </v-btn>
    </div>
  </div>
</template>

<style scoped>
.input-action-btn {
  align-self: center;
}

.input-action-btn.for-viewport {
  align-self: baseline;
  margin-top: 8px;
}

.viewports-area {
  width: 100%;
  margin-bottom: 16px;
}

.actions-area {
  text-align: right;
}
</style>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { Action, Mutation, State, Getter } from "vuex-class";
import { ModalService } from "../../services/modalService";
import { BackstopTest } from "../../models/backstopTest";
import { backstopFieldHelp } from "../../constants/backstopFieldHelp";
import AddTestFieldModalComponent from "./AddTestFieldModalComponent.vue";
import { backstopScenarioProperties } from "@/constants/backstopScenarioProperties";
import { EngineScript } from "@/models/engineScript";
import ViewportsComponent from "./ViewportsComponent.vue";
import { Viewport } from "@/models/viewport";
import { EngineScriptHelper } from "../../controllers/EngineScriptHelper";
import TestActionsComponent from "./TestActionsComponent.vue";

@Component({
  components: {
    ViewportsComponent,
    TestActionsComponent
  }
})
export default class TestConfigurationComponent extends Vue {
  @State((state) => state.testRunnerStore.testRunning)
  private readonly testRunning!: boolean;

  @Action("testRunnerStore/runTest")
  private readonly runTest!: (testLabel: string) => Promise<void>;

  @Mutation("configurationStore/setScenarioField")
  private setScenarioField!: (paylod: {scenarioIndex: number, field: string, value: unknown}) => void;

  @Mutation("configurationStore/removeScenarioField")
  private readonly removeScenarioField!: (payload: {index: number, fieldName: string}) => void;

  @Action("engineScriptStore/addActionsScript")
  private readonly addActionsScript!: () => Promise<void>;

  @Action("applicationStore/displaySnackbar")
  private readonly displaySnackbar!: (payload: {text: string, success: boolean}) => void;

  @State((state) => state.engineScriptStore.scripts)
  private readonly scripts!: EngineScript[];

  @Getter("configurationStore/engineScriptDirectory")
  private readonly engineScriptDirectory!: string;

  @Getter("engineScriptStore/getScript")
  private readonly getScript!: (path: string) => EngineScript | undefined;

  @Prop({ required: true, type: Object })
  private readonly testContent!: BackstopTest;

  @Prop({ required: true, type: Number })
  private readonly testIndex!: number;

  private get additionnalFields(): Array<{name: string, value: unknown, type: string}> {
    const result = [];
    for (const key in this.testContent) {
      if (key !== "label" && key !== "url" &&
        key !== "actions") { // those are the two mandatory fields that are always here
        const entry: {
          name: string,
          value: unknown
          type: string
        } = {
          name: key,
          value: this.testContent[key],
          type: ""
        };
        const matchingPredefinedField = backstopScenarioProperties.find((field) => field.name === key);
        if (matchingPredefinedField) {
          entry.type = matchingPredefinedField.type;
        } else if (Array.isArray(this.testContent[key])) {
          entry.type = "array";
        } else {
          entry.type = typeof this.testContent[key];
        }
        result.push(entry);
      }
    }
    return result;
  }

  private get scriptNames() {
    return EngineScriptHelper.getScriptsName(this.scripts, this.engineScriptDirectory);
  }

  private addNewField() {
    ModalService.launchModal(AddTestFieldModalComponent)
      .then((newField: {name: string, value: unknown, type: string}) => {
        this.validateField(newField);
      });
  }

  private addViewport(fieldValue: unknown) {
    if (Array.isArray(fieldValue)) {
      fieldValue.push(new Viewport());
    }
  }

  private enableActions() {
    if (!this.getScript("actions")) {
      ModalService.launchConfirmationModal("'Actions' engine script does not exist but is needed." +
        "Would you like to add it? If it not added you won't be able to use actions.")
        .then(() => {
          this.addActionsScript();
          this.setScenarioField({ scenarioIndex: this.testIndex, field: "onReadyScript", value: "actions.js" });
          this.setScenarioField({ scenarioIndex: this.testIndex, field: "actions", value: [] });
          debugger;
        }).catch(() => {
          this.displaySnackbar({ text: "Failed to create actions in your test", success: false });
        });
    } else {
      this.setScenarioField({ scenarioIndex: this.testIndex, field: "actions", value: [] });
    }
  }

  private getHelpMessage(fieldName: string) {
    if (backstopFieldHelp.has(fieldName)) {
      return backstopFieldHelp.get(fieldName);
    }
    return "";
  }

  private removeField(fieldName: string) {
    ModalService.launchConfirmationModal("Do you really wish to delete this entry?")
      .then(() => {
        this.removeScenarioField({ index: this.testIndex, fieldName });
      });
  }

  private removeViewport(fieldValue: unknown, index: number) {
    if (Array.isArray(fieldValue)) {
      fieldValue.splice(index, 1);
    }
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

  private updateField(field: string, value: unknown) {
    this.setScenarioField({ scenarioIndex: this.testIndex, field, value });
  }

  private updateViewportField(fieldValue: unknown, index: number, field: string, value: unknown) {
    if (Array.isArray(fieldValue)) {
      Vue.set(fieldValue[index], field, value);
    }
  }

  private validateField(newField: {name: string, value: unknown, type: string}) {
    if (newField.name !== null) {
      if (newField.type === "number" && typeof newField.value === "string") {
        newField.value = Number.parseFloat(newField.value);
      }
      this.updateField(newField.name, newField.value);
    }
  }
}
</script>
