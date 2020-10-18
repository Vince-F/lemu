<template>
  <v-dialog
      v-model="dialogDisplayed"
      max-width="400"
    >
    <v-card>
      <v-card-title class="headline">
        Save as template
      </v-card-title>

      <v-card-text>
        <v-form
         v-model="valid"
         ref="form">
          <v-text-field v-model="fileName" label="Template name" :rules="filenameRules"></v-text-field>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary darken-1"
          text
          @click="add"
        >
          Save as template
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
import { State, Action } from "vuex-class";
import { EngineScriptTemplate } from '@/models/engineScriptTemplate';

interface ElectronFile extends File {
  path: string;
}

@Component
export default class AddScriptModalComponent extends Vue {
  @Prop(Object)
  private readonly payload!: any;

  @State((state) => state.templateStore.scripts)
  private readonly scripts!: EngineScriptTemplate[];

  private dialogDisplayed: boolean;
  private fileName: string;
  private valid: boolean;
  private filenameRules: Array<(value: string) => boolean | string>;

  constructor() {
    super(arguments);
    this.dialogDisplayed = true;
    this.valid = false;
    this.fileName = "";
    this.filenameRules = [
      (value: string) => value.length > 0 || "You must enter a file name"
    ];
  }

  private created() {
    if (this.payload && typeof this.payload.fileName === "string") {
      this.fileName = this.payload.fileName;
    }
  }

  private mounted() {
    this.filenameRules.push(
      (value: string) => (!this.scripts || this.scripts.length === 0 ||
        !this.scripts.find((val) => val.name === value)) ||
        "A template with this name already exists"
    );
  }

  private add() {
    (this.$refs.form as any).validate(); // this is Veutify v-form component
    if (this.valid) {
      this.$emit("validate", this.fileName);
    }
  }

  private dismiss() {
    this.dialogDisplayed = false;
    this.$emit("dismiss");
  }
}
</script>