<template>
  <v-dialog
      v-model="dialogDisplayed"
      max-width="400"
    >
    <v-card>
      <v-card-title class="headline">Add field</v-card-title>
      <v-card-text>
        <v-form
          v-model="valid"
          ref="form">
          <v-select
            :items="modes"
            label="Mode"
            v-model="currentMode"
          ></v-select>
          <div v-if="currentMode === 'custom'">
            <v-text-field
              label="Field name"
              v-model="fieldName"
              :rules="fieldNameRules"
              ></v-text-field>
            <v-select
              :items="types"
              label="Type"
              v-model="fieldType"
              @change="updateNewValueType"
              :rules="typeRules"
            ></v-select>
          </div>
          <div v-else-if="currentMode === 'pre-defined'">
            <v-select
              :items="predefinedFields"
              label="Predefined field"
              v-model="selectedField"
              item-text="name"
              :messages="helpMessage"
              return-object
              @change="updateNewValueTypeWithPredefinedField"
              :rules="predefinedFieldRules"
            ></v-select>                
          </div>
          <v-text-field
            v-if="fieldType === 'number'" label="Value" 
            type="number" v-model="fieldValue"
            ></v-text-field>
          <v-checkbox v-else-if="fieldType === 'boolean'" label="Value"
            v-model="fieldValue"
            ></v-checkbox>
          <v-combobox v-else-if="fieldType === 'array'" multiple chips
            label="Value" v-model="fieldValue"
            ></v-combobox>
          <v-select v-if="fieldType === 'scripts'" :items="scriptNames"
            label="Value" multiple v-model="fieldValue"></v-select>
          <v-text-field v-else 
          label="Value" v-model="fieldValue"
          ></v-text-field>
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
import { Vue, Component, Prop } from "vue-property-decorator";
import { State, Getter, Action } from "vuex-class";
import { backstopScenarioProperties } from '../../constants/backstopScenarioProperties';
import { backstopFieldHelp } from "../../constants/backstopFieldHelp";
import { EngineScript } from '@/models/engineScript';

@Component({})
export default class AddTestFieldModalComponent extends Vue {
  @State((state) => state.engineScriptStore.scripts)
  private readonly scripts!: EngineScript[];
  @Getter("configurationStore/engineScriptDirectory")
  private readonly engineScriptDirectory!: string;
  @Action("engineScriptStore/retrieveEngineScripts")
  private readonly retrieveEngineScripts!: () => Promise<void>;

  private dialogDisplayed: boolean;
  private readonly predefinedFields: Array<{name: string,
    type: "string" | "number" | "array" | "boolean" | "scripts" }>;
  private readonly modes: string[];
  private readonly types: string[];
  private currentMode: string;
  private selectedField: {name: string,  type: "string" | "number" | "array" | "boolean" | "scripts" } | null;
  private fieldName: string;
  private fieldType: string;
  private valid: boolean;
  private fieldValue: number | boolean | string | string[];
  private fieldNameRules: Array<(value: string) => boolean | string>;
  private typeRules: Array<(value: any) => boolean | string>;
  private predefinedFieldRules: Array<(value: any) => boolean | string>;

  constructor() {
    super(arguments);
    this.dialogDisplayed = true;
    this.predefinedFields = backstopScenarioProperties;
    this.modes = ["pre-defined", "custom"];
    this.types = ["number", "boolean", "array", "string"];

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
      (value: any) => !!value || "You must choose a type"
    ];

    this.predefinedFieldRules = [
      (value: any) => !!value || "You must choose a field"
    ];
  }

  private created() {
    this.retrieveEngineScripts();
  }

  private get helpMessage() {
    if (backstopFieldHelp.has(this.selectedField?.name || "")) {
      return backstopFieldHelp.get(this.selectedField?.name || "");
    }
    return "";
  }

  private get scriptNames() {
    let scriptDirectory = this.engineScriptDirectory.replace(/\\/g, "/");
    if (!scriptDirectory.endsWith("/")) {
      scriptDirectory += "/";
    }
    return this.scripts.map((script) => {
      return script.path.replace(scriptDirectory, "");
    });
  }

  private addField() {
    (this.$refs.form as any).validate(); // this is Veutify v-form component
    if (this.valid) {
      this.dialogDisplayed = false;
      this.$emit("validate", {
        name: this.fieldName,
        value: this.fieldValue,
        type: this.fieldType
      });
    }
  }

  private dismiss() {
    this.dialogDisplayed = false;
    this.$emit("dismiss");
  }

  private updateNewValueType() {
    switch (this.fieldType) {
      case 'array':
      case 'scripts':
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

  private updateNewValueTypeWithPredefinedField() {
    if (this.selectedField) {
      this.fieldName = this.selectedField.name;
      this.fieldType = this.selectedField.type;
      this.updateNewValueType();
    }
  }
}
</script>