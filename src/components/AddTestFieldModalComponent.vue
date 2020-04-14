<template>
  <v-dialog
      v-model="dialogDisplayed"
      max-width="400"
    >
    <v-card>
      <v-card-title class="headline">Add field</v-card-title>
      <v-card-text>
        <v-select
          :items="modes"
          label="Mode"
          v-model="currentMode"
        ></v-select>
        <div v-if="currentMode === 'custom'">
          <v-text-field
            label="Field name"
            v-model="fieldName"
            ></v-text-field>
          <v-select
            :items="types"
            label="Type"
            v-model="fieldType"
            @change="updateNewValueType"
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
          ></v-select>                
        </div>
        <v-text-field class=""
          v-if="fieldType === 'number'" label="Value" 
          type="number" v-model="fieldValue"
          ></v-text-field>
        <v-checkbox class="" v-else-if="fieldType === 'boolean'" label="Value"
          v-model="fieldValue"
          ></v-checkbox>
        <v-combobox class="" v-else-if="fieldType === 'array'" multiple chips
          label="Value" v-model="fieldValue"
          ></v-combobox>
        <v-text-field class=""
          v-else label="Value" v-model="fieldValue"
          ></v-text-field>
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
          cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog> 
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { backstopScenarioProperties } from '../constants/backstopScenarioProperties';
import { backstopFieldHelp } from "../constants/backstopFieldHelp";

@Component({})
export default class AddTestFieldModalComponent extends Vue {
  private dialogDisplayed: boolean = true;
  private readonly predefinedFields: Array<{name: string,  type: "string" | "number" | "array" | "boolean" }>;
  private readonly modes: string[];
  private readonly types: string[];
  private currentMode: string;
  private selectedField: {name: string,  type: "string" | "number" | "array" | "boolean" } | null;
  private fieldName: string;
  private fieldType: string;
  private fieldValue: number | boolean | string | string[];

  constructor() {
    super(arguments);
    this.predefinedFields = backstopScenarioProperties;
    this.modes = ["pre-defined", "custom"];
    this.types = ["number", "boolean", "array", "string"];

    this.currentMode = "pre-defined";
    this.fieldName = "";
    this.fieldType = "";
    this.fieldValue = "";
    this.selectedField = null;
  }

  private get helpMessage() {
    if (backstopFieldHelp.has(this.selectedField?.name || "")) {
      return backstopFieldHelp.get(this.selectedField?.name || "");
    }
    return "";
  }

  private addField() {
    this.dialogDisplayed = false;
    this.$emit("validate", {
      name: this.fieldName,
      value: this.fieldValue,
      type: this.fieldType
    });
  }

  private dismiss() {
    this.dialogDisplayed = false;
    this.$emit("dismiss");
  }

  private updateNewValueType() {
    switch (this.fieldType) {
      case 'array':
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