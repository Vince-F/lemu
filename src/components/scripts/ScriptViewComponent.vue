<template>
  <v-card v-if="customScriptData" class="card">
    <v-card-title class="header flex-grow-0 flex-shrink-0">
      {{scriptName}}
    </v-card-title>
    <v-card-text class="content flex-grow-1 flex-shrink-1">
      <v-text-field
        label="Path"
        :value="customScriptData.path"
        readonly
        ></v-text-field>

      <monaco-editor 
        theme="vs-dark"
        language="javascript"
        :value="customScriptData.content"
        @change="updateScriptContent"/>
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
}
</style>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { Getter, Mutation } from "vuex-class";
import { CustomScript } from '../../models/customScript';
import MonacoEditor from 'monaco-editor-vue';

@Component({
  components: {
    MonacoEditor
  }
})
export default class ScriptViewComponent extends Vue {
  @Getter("customScriptStore/getScript")
  private readonly getScript!: (path: string) => CustomScript;
  @Mutation("customScriptStore/setScriptContent")
  private readonly setScriptContent!: (payload: {path: string, content: string}) => void;
  private customScriptData: CustomScript;

  constructor() {
    super(arguments);
    this.customScriptData = new CustomScript("", "");
  }

  private get scriptName() {
    const path = this.customScriptData.path.split(/\/|\\/);
    return path[path.length - 1];
  }

  private created() {
    this.loadScript();
  }

  private loadScript() {
    this.customScriptData = this.getScript(decodeURIComponent(this.$route.params.path));
  }

  @Watch("$route")
  private updateScript() {
    this.loadScript();
  }

  private updateScriptContent(newContent: string) {
    this.setScriptContent({
      path: this.customScriptData.path,
      content: newContent
    });
  }
}
</script>