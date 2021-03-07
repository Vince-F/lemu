<template>
  <v-dialog
      v-model="dialogDisplayed"
      max-width="400"
    >
    <v-card>
      <v-card-title class="headline">Add field</v-card-title>
      <v-card-text>
        <v-form v-model="valid" ref="form">
          <v-select outlined dense
            :items="modes" label="Mode" v-model="currentMode" />
          <div v-if="currentMode === 'custom'">
            <v-text-field outlined dense
              label="Field name" v-model="fieldName" :rules="fieldNameRules" />
            <v-select outlined dense
              :items="types" label="Type" v-model="fieldType"
              @change="updateNewValueType" :rules="typeRules" />
          </div>
          <div v-else-if="currentMode === 'pre-defined'">
            <v-select outlined dense
              :items="predefinedFields" label="Predefined field" v-model="selectedField"
              item-text="name" :messages="helpMessage" return-object
              @change="updateNewValueTypeWithPredefinedField" :rules="predefinedFieldRules" />                
          </div>
          <v-text-field outlined dense
            v-if="fieldType === 'number'" label="Value" type="number" v-model="fieldValue" />
          <v-checkbox v-else-if="fieldType === 'boolean'" label="Value"
            v-model="fieldValue"/>
          <v-combobox outlined dense v-else-if="fieldType === 'array' || fieldType === 'selectors'" multiple
            label="Value" v-model="fieldValue"/>
          <v-select outlined dense v-else-if="fieldType === 'scripts'" :items="scriptNames"
            label="Value" multiple v-model="fieldValue" />
          <viewports-component v-else-if="fieldType === 'viewports'" 
            :viewports="fieldValue" @addViewport="addViewport"
            @removeViewport="removeViewport" @updateViewportField="updateViewportField" />
          <v-text-field outlined dense v-else label="Value" v-model="fieldValue" />
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary darken-1"
          text
          @click="addField"
        >
          Add
        </v-btn>

        <v-btn
          color="grey darken-1"
          text
          @click="dismiss"
        >
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog> 
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { State, Getter, Action } from "vuex-class";
import { backstopScenarioProperties } from '../../constants/backstopScenarioProperties';
import { backstopFieldHelp } from "../../constants/backstopFieldHelp";
import { EngineScript } from '@/models/engineScript';
import ViewportsComponent from "./ViewportsComponent.vue";
import { Viewport } from '@/models/viewport';
import { backstopFieldType } from "@/models/backstopFieldType";
import { EngineScriptHelper } from "../../controllers/EngineScriptHelper";

@Component({
  components: {
    ViewportsComponent
  }
})
export default class AddTestFieldModalComponent extends Vue {
  @State((state) => state.engineScriptStore.scripts)
  private readonly scripts!: EngineScript[];
  @Getter("configurationStore/engineScriptDirectory")
  private readonly engineScriptDirectory!: string;

  private dialogDisplayed: boolean;
  private readonly predefinedFields: Array<{name: string,
    type: backstopFieldType }>;
  private readonly modes: string[];
  private readonly types: string[];
  private currentMode: string;
  private selectedField: {name: string, type: backstopFieldType } | null;
  private fieldName: string;
  private fieldType: string;
  private valid: boolean;
  private fieldValue: number | boolean | string | string[] | Viewport[];
  private fieldNameRules: Array<(value: string) => boolean | string>;
  private typeRules: Array<(value: unknown) => boolean | string>;
  private predefinedFieldRules: Array<(value: unknown) => boolean | string>;

  constructor() {
    super(arguments);
    this.dialogDisplayed = true;
    this.predefinedFields = backstopScenarioProperties;
    this.modes = ["pre-defined", "custom"];
    this.types = ["number", "boolean", "array", "string", "selector", "selectors"];

    this.currentMode = "pre-defined";
    this.fieldName = "";
    this.fieldType = "";
    this.fieldValue = "";
    this.selectedField = null;

    this.valid = false;

    this.fieldNameRules = [
      (value: string) => value.length > 0 || "The field name must not be empty"
    ];

    this.typeRules = [
      (value: unknown) => !!value || "You must choose a type"
    ];

    this.predefinedFieldRules = [
      (value: unknown) => !!value || "You must choose a field"
    ];
  }

  private get helpMessage() {
    if (backstopFieldHelp.has(this.selectedField?.name || "")) {
      return backstopFieldHelp.get(this.selectedField?.name || "");
    }
    return "";
  }

  private get scriptNames() {
    return EngineScriptHelper.getScriptsName(this.scripts, this.engineScriptDirectory);
  }

  private addField() {
    (this.$refs.form as any).validate(); // this is Vuetify v-form component
    if (this.valid) {
      this.dialogDisplayed = false;
      this.$emit("validate", {
        name: this.fieldName,
        value: this.fieldValue,
        type: this.fieldType
      });
    }
  }

  private addViewport() {
    if (Array.isArray(this.fieldValue)) {
      (this.fieldValue as Viewport[]).push(new Viewport());
    }
  }

  private dismiss() {
    this.dialogDisplayed = false;
    this.$emit("dismiss");
  }

  private removeViewport(index: number) {
    if (Array.isArray(this.fieldValue)) {
      this.fieldValue.splice(index, 1);
    }
  }

  private updateNewValueType() {
    switch (this.fieldType) {
      case 'array':
      case 'scripts':
      case 'viewports':
      case 'selectors':
        this.fieldValue = [];
        break;
      case 'boolean':
        this.fieldValue = false;
        break;
      case 'number':
        this.fieldValue = 0;
        break;
      default:
        this.fieldValue = "";
        break;
    }
  }

  private updateViewportField(index: number, field: string, value: any) {
    if (Array.isArray(this.fieldValue) && this.fieldValue[index]) {
      Vue.set((this.fieldValue[index] as Viewport), field, value);
    }
  }

  private updateNewValueTypeWithPredefinedField() {
    if (this.selectedField) {
      this.fieldName = this.selectedField.name;
      this.fieldType = this.selectedField.type;
      this.updateNewValueType();
    }
  }
}
</script>