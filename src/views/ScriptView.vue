<template>
  <menu-and-content-component>
    <template v-slot:menu>
      <script-menu-component />
    </template>
    <template v-slot:view>
      <router-view />
    </template>
  </menu-and-content-component>
</template>

<style scoped>
</style>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Action, Mutation } from "vuex-class";
import ScriptMenuComponent from "../components/scripts/ScriptMenuComponent.vue";
import MenuAndContentComponent from "../components/MenuAndContentComponent.vue";

@Component({
  components: {
    ScriptMenuComponent,
    MenuAndContentComponent
  }
})
export default class ScriptView extends Vue {
  @Action("templateStore/retrieveEngineScriptTemplates")
  private readonly retrieveEngineScriptTemplates!: () => Promise<void>;
  @Action("applicationStore/displaySnackbar")
  private readonly displaySnackbar!: (payload: {text: string, success: boolean}) => void;

  constructor() {
    super(arguments);
  }

  private created() {
    this.retrieveEngineScriptTemplates()
      .catch(() => {
        this.displaySnackbar({text: "Failed to load engine script templates", success: false});
      });
  }
}
</script>