<template>
  <v-card v-if="script" class="card">
    <v-card-title class="header flex-grow-0 flex-shrink-0">
      <div class="flex-grow-1 flex-shrink-1">
        {{script.name}}
      </div>
      <div class="flex-grow-0 flex-shrink-0">
        <v-tooltip top>
          <template v-slot:activator="{on}">
            <v-btn icon @click="deleteScript" v-on="on">
              <v-icon>
                mdi-delete
              </v-icon>
            </v-btn>
          </template>
          Delete
        </v-tooltip>
      </div>
    </v-card-title>
    <v-card-text class="content flex-grow-1 flex-shrink-1">
      <v-text-field
        class="flex-grow-0 flex-shrink-0"
        label="Name"
        :value="script.name"
        @input="updateScriptName"
        ></v-text-field>
      <div class="code-container flex-grow-1 flex-shrink-1">
        <monaco-editor
          theme="vs-dark"
          width="99%"
          height="97%"
          language="javascript"
          :value="script.content"
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
import MonacoEditor from 'monaco-editor-vue';
import { ModalService } from '@/services/modalService';
import { EngineScriptTemplate } from '@/models/engineScriptTemplate';

@Component({
  components: {
    MonacoEditor
  }
})
export default class TemplateScriptViewComponent extends Vue {
  @Getter("templateStore/getScriptByName")
  private readonly getScriptByName!: (name: string) => EngineScriptTemplate;
  @Mutation("templateStore/removeEngineScriptTemplate")
  private readonly removeEngineScriptTemplate!: (script: EngineScriptTemplate) => void;
  @Mutation("templateStore/setEngineScriptTemplateContent")
  private readonly setEngineScriptTemplateContent!: (payload: {name: string, content: string}) => void;
  @Action("applicationStore/displaySnackbar")
  private readonly displaySnackbar!: (payload: {text: string, success: boolean}) => void;
  @Mutation("templateStore/setEngineScriptTemplateName")
  private readonly setEngineScriptTemplateName!: (payload: {script: EngineScriptTemplate, newName: string}) => void;
  private script: EngineScriptTemplate | null;

  constructor() {
    super(arguments);
    this.script = null;
  }

  private created() {
    this.loadScript();
  }

  private deleteScript() {
    if (this.script) {
      const scriptToDelete = this.script;
      ModalService.launchConfirmationModal("Do you want to delete this script?")
        .then(() => {
          this.removeEngineScriptTemplate(scriptToDelete);
          this.$router.push({name: "scriptTemplates.welcome"});
        });
    }
  }

  private loadScript() {
    this.script = this.getScriptByName(decodeURIComponent(this.$route.params.name));
  }

  @Watch("$route")
  private updateScript() {
    this.loadScript();
  }

  private updateScriptContent(newContent: string) {
    if (this.script) {
      const scriptName = this.script.name;
      this.setEngineScriptTemplateContent({
        name: this.script.name,
        content: newContent
      });
    }
  }

  private updateScriptName(newName: string) {
    if (this.script) {
      this.setEngineScriptTemplateName({script: this.script, newName});
    }
  }
}
</script>