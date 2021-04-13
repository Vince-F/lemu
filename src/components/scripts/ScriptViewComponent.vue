<template>
  <v-card v-if="engineScriptData" class="card">
    <v-card-title class="header flex-grow-0 flex-shrink-0">
      <div class="flex-grow-1 flex-shrink-1">
        {{scriptName}}
      </div>
      <div class="flex-grow-0 flex-shrink-0">
        <entity-menu-bar-action-component iconName="mdi-archive-arrow-up" tooltipContent="Save as a template"
          @click="saveAsTemplate"/>
        <entity-menu-bar-action-component iconName="mdi-delete" tooltipContent="Delete"
          @click="deleteScript" />
      </div>
    </v-card-title>
    <v-card-text class="content flex-grow-1 flex-shrink-1">
      <v-text-field
        class="flex-grow-0 flex-shrink-0"
        label="Path"
        :value="engineScriptData.path"
        readonly
        ></v-text-field>
      <div class="code-container flex-grow-1 flex-shrink-1">
        <monaco-editor
          theme="vs-dark"
          width="99%"
          height="97%"
          language="javascript"
          :value="engineScriptData.content"
          @change="updateScriptContent"/>
      </div>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.header {
  border-bottom: 1px solid rgba(0,0,0,0.18);
}

.content {
  overflow:auto;
  display: flex;
  flex-direction: column;
}
</style>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { Getter, Mutation, Action } from "vuex-class";
import { EngineScript } from "../../models/engineScript";
import MonacoEditor from "monaco-editor-vue";
import { ModalService } from "@/services/modalService";
import SaveAsScriptTemplateModalComponent from "./SaveAsScriptTemplateModalComponent.vue";
import EntityMenuBarActionComponent from "../layout/EntityMenuBarActionComponent.vue";

@Component({
  components: {
    MonacoEditor,
    EntityMenuBarActionComponent
  }
})
export default class ScriptViewComponent extends Vue {
  @Getter("engineScriptStore/getScript")
  private readonly getScript!: (path: string) => EngineScript;

  @Mutation("engineScriptStore/setScriptContent")
  private readonly setScriptContent!: (payload: {path: string, content: string}) => void;

  @Action("templateStore/createEngineScriptTemplate")
  private readonly createEngineScriptTemplate!: (payload: {name: string, content: string}) => Promise<void>;

  @Mutation("engineScriptStore/removeScript")
  private readonly removeScript!: (scriptPath: string) => void;

  @Action("applicationStore/displaySnackbar")
  private readonly displaySnackbar!: (payload: {text: string, success: boolean}) => void;

  private engineScriptData: EngineScript;

  constructor() {
    super(arguments);
    this.engineScriptData = new EngineScript("", "");
  }

  private get scriptName() {
    const path = this.engineScriptData.path.split(/\/|\\/);
    return path[path.length - 1];
  }

  private created() {
    this.loadScript();
  }

  private deleteScript() {
    ModalService.launchConfirmationModal("Do you want to delete this script?")
      .then(() => {
        this.removeScript(this.engineScriptData.path);
        this.$router.push("/tests/engineScripts");
      });
  }

  private loadScript() {
    this.engineScriptData = this.getScript(decodeURIComponent(this.$route.params.path));
  }

  private saveAsTemplate() {
    ModalService.launchModal(SaveAsScriptTemplateModalComponent)
      .then((name: string) => {
        this.createEngineScriptTemplate({ name, content: this.engineScriptData.content })
          .then(() => {
            this.displaySnackbar({ text: "Template successfully created.", success: true });
          }).catch((error) => {
            this.displaySnackbar({ text: "Error when creating template " + error, success: false });
          });
      });
  }

  @Watch("$route")
  private updateScript() {
    this.loadScript();
  }

  private updateScriptContent(newContent: string) {
    this.setScriptContent({
      path: this.engineScriptData.path,
      content: newContent
    });
  }
}
</script>
