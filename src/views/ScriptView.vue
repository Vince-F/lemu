<template>
  <div v-if="loading">

  </div> 
  <v-container v-else fluid class="container pa-0">
    <div class="menu">
      <script-menu-component />
    </div>
    <div class="content">
      <router-view />
    </div>
  </v-container>
</template>

<style scoped>
.container {
  display: flex;
  height: 100%;
}

.menu {
  flex: 0;
  height: 100%;
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  flex-basis: 250px;
  max-width: 250px;
  width: 250px;
  background: white;  
}

.content {
  flex: 1;
  height: 100%;
  max-height: 100%;
  overflow: auto;
}
</style>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Action, Mutation } from "vuex-class";
import ScriptMenuComponent from "../components/scripts/ScriptMenuComponent.vue";

@Component({
  components: {
    ScriptMenuComponent
  }
})
export default class ScriptView extends Vue {
  @Action("engineScriptStore/retrieveEngineScripts")
  private readonly retrieveEngineScripts!: () => Promise<void>;
  @Action("templateStore/retrieveEngineScriptTemplates")
  private readonly retrieveEngineScriptTemplates!: () => Promise<void>;
  @Action("applicationStore/displaySnackbar")
  private readonly displaySnackbar!: (payload: {text: string, success: boolean}) => void;

  private loading: boolean;

  constructor() {
    super(arguments);
    this.loading = true;
  }

  private created() {
    this.retrieveEngineScripts()
      .catch((error) => {
        this.displaySnackbar({text: "Failed to load engine scripts " + error, success: false});
      })
      .finally(() => {
        this.loading = false;
      });
    this.retrieveEngineScriptTemplates()
      .catch(() => {
        this.displaySnackbar({text: "Failed to load engine script templates", success: false});
      });
  }
}
</script>