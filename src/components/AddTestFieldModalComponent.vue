<template>
  <v-dialog
      v-model="dialogDisplayed"
      max-width="400"
    >
    <v-card>
      <v-card-title class="headline">Add field</v-card-title>
      <v-card-text>
        <!--<v-select
          :items="modes"
          label="Mode"
          v-model="currentMode"
        ></v-select>-->
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

@Component({})
export default class AddTestFieldModalComponent extends Vue {
  private dialogDisplayed: boolean = true;
  private readonly modes: string[];
  private readonly types: string[];
  private currentMode: string;
  private fieldName: string;
  private fieldType: string;
  private fieldValue: number | boolean | string | string[];

  constructor() {
    super(arguments);
    this.modes = ["pre-defined", "custom"];
    this.types = ["number", "boolean", "array", "string"];

    this.currentMode = "custom";
    this.fieldName = "";
    this.fieldType = "";
    this.fieldValue = "";
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
}
</script>