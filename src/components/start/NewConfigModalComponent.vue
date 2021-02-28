<template>
  <v-dialog v-model="dialogDisplayed" max-width="800">
    <v-card>
      <v-card-title class="headline">
        Create new configuration
      </v-card-title>

      <v-card-text>
        <v-form v-model="valid" ref="form">
          <v-select
            :items="templates"
            label="Template"
            v-model="selectedTemplate"
            item-text="id"
            return-object
          ></v-select>    
          <v-text-field @click="selectDirectory"
            readonly clearable
            v-model="configurationDirectory" 
            label="Configuration directory" 
            :rules="directoryRules"
            prepend-icon="mdi-folder"></v-text-field>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary darken-1" text @click="create">
          Create
        </v-btn>
        <v-btn color="grey darken-1" text @click="dismiss">
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { BackstopConfiguration } from "@/models/backstopConfiguration";
import { DialogFileService } from "@/services/dialogFileService";
import { Vue, Component } from "vue-property-decorator";
import { Action, State } from "vuex-class";

@Component
export default class AddScriptModalComponent extends Vue {
  @State((state) => state.templateStore.configurationTemplates)
  private readonly configurationTemplates!: BackstopConfiguration[];
  @Action("templateStore/retrieveConfigurationTemplates")
  private readonly retrieveConfigurationTemplates!: () => Promise<void>;

  private dialogDisplayed: boolean;
  private configurationDirectory: string;
  private selectedTemplate: BackstopConfiguration | null;
  private valid: boolean;
  private directoryRules: Array<(value: string) => boolean | string>;

  constructor() {
    super(arguments);
    this.dialogDisplayed = true;
    this.selectedTemplate = null;
    this.valid = false;
    this.configurationDirectory = "";
    this.directoryRules = [
      (value: string) => value && value.length > 0 || "You must select a directory where to save the configuration"
    ];
  }

  private created() {
    this.retrieveConfigurationTemplates();
  }

  private get templates() {
    let templates = [new BackstopConfiguration({id: "default"})];
    if (Array.isArray(this.configurationTemplates)) {
      templates = templates.concat(this.configurationTemplates);
    }
    return templates;
  }

  private create() {
    (this.$refs.form as any).validate(); // this is Vuetify v-form component
    if (this.valid) {
      this.$emit("validate", {
        template: this.selectedTemplate,
        directory: this.configurationDirectory
      });
    }
  }

  private dismiss() {
    this.dialogDisplayed = false;
    this.$emit("dismiss");
  }

  private selectDirectory() {
    DialogFileService.selectDirectory()
      .then((directory) => {
        this.configurationDirectory = directory;
      });
  }
}
</script>