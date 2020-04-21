<template>
  <v-dialog
      v-model="dialogDisplayed"
      max-width="400"
    >
    <v-card>
      <v-card-title class="headline">Add engine option</v-card-title>
      <v-card-text>
        <v-text-field
          label="Option name"
          v-model="name"
          ></v-text-field>
        <v-select
          :items="types"
          label="Type"
          v-model="type"
          @change="updateNewValueType"
        ></v-select>
        <v-text-field v-if="type === 'number'" label="Value" 
          type="number" v-model="value"
          ></v-text-field>
        <v-checkbox v-else-if="type === 'boolean'" label="Value"
          v-model="value"
          ></v-checkbox>
        <v-combobox v-else-if="type === 'array'" multiple chips
          label="Value" v-model="value"
          ></v-combobox>
        <v-text-field v-else label="Value" v-model="value"
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
import { backstopScenarioProperties } from '../../constants/backstopScenarioProperties';

@Component({})
export default class AddEngineOptionModalComponent extends Vue {
  private dialogDisplayed: boolean;
  private readonly types: string[];
  private name: string;
  private type: string;
  private value: number | boolean | string | string[];

  constructor() {
    super(arguments);
    this.dialogDisplayed = true;
    this.types = ["number", "boolean", "array", "string"];
    this.name = "";
    this.type = "";
    this.value = "";
  }

  private addField() {
    this.dialogDisplayed = false;
    this.$emit("validate", {
      name: this.name,
      value: this.value,
      type: this.type
    });
  }

  private dismiss() {
    this.dialogDisplayed = false;
    this.$emit("dismiss");
  }

  private updateNewValueType() {
    switch (this.type) {
      case 'array':
        this.value = [];
        break;
      case 'boolean':
        this.value = false;
        break;
      case 'number':
        this.value = 0;
        break;
      default:
        this.value = "";
        break;
    }
  }
}
</script>