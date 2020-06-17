<template>
  <v-dialog
      v-model="dialogDisplayed"
      max-width="400"
    >
    <v-card>
      <v-card-title class="headline">
        Add engine script
      </v-card-title>

      <v-card-text>
        <v-form
         v-model="valid"
         ref="form">
          <v-btn-toggle
            v-model="type"
            tile
            color="primary accent-3"
            group
          >
            <v-btn value="empty">
              Empty
            </v-btn>

            <v-btn value="fromFile">
              Existing file
            </v-btn>
          </v-btn-toggle>
          <div v-if="type === 'empty'">
            <v-text-field v-model="fileName" label="File name" :rules="filenameRules"></v-text-field>
          </div>
          <div v-else-if="type === 'fromFile'">
            <v-file-input v-model="fileToCopy" accept="text/javascript" label="File to copy" :rules="fileRules"></v-file-input>
          </div>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="primary darken-1"
          text
          @click="add"
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

interface ElectronFile extends File {
  path: string;
}

@Component
export default class AddScriptModalComponent extends Vue {
  private dialogDisplayed: boolean;
  private type: "empty" | "fromFile";
  private fileToCopy: ElectronFile | null;
  private fileName: string;
  private valid: boolean;
  private filenameRules: Function[];
  private fileRules: Function[];

  constructor() {
    super(arguments);
    this.dialogDisplayed = true;
    this.type = "empty";
    this.fileToCopy = null;
    this.fileName = "";
    this.valid = false;
    this.filenameRules = [
      (value: string) => value.length > 0 || "You must enter a file name"
    ];
    this.fileRules = [
      (value: File) => value !== null || "You must choose a file"
    ];
  }

  private add() {
    (this.$refs.form as any).validate(); // this is Veutify v-form component
    if (this.valid) {
      switch (this.type) {
        case "empty":
          this.$emit("validate", {
            type: this.type,
            fileName: this.fileName
          });
          this.dialogDisplayed = false;
          break;
      case "fromFile":
        if (this.fileToCopy) {
          this.$emit("validate", {
            type: this.type,
            fileName: this.fileToCopy.name,
            originFilePath: this.fileToCopy.path
          });
          this.dialogDisplayed = false;
        }
        break;
      }
    }
  }

  private dismiss() {
    this.dialogDisplayed = false;
    this.$emit("dismiss");
  }
}
</script>