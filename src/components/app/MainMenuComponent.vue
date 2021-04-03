<template>
  <base-menu-component :menus="menus" />
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import BaseMenuComponent from "./BaseMenuComponent.vue";

@Component({
  name: "main-menu-component",
  components: {
    BaseMenuComponent
  }
})
export default class MainMenuComponent extends Vue {
  private menus: Array<{ title: string; icon: string; path: string }>;

  constructor() {
    super(arguments);
    this.menus = [
      {
        title: "General configuration",
        icon: "mdi-cog",
        path: "/tests/generalConfig"
      },
      { title: "Tests", icon: "mdi-bug", path: "/tests/list" },
      {
        title: "Engine scripts",
        icon: "mdi-script",
        path: "/tests/engineScripts"
      },
      { title: "Reports", icon: "mdi-clipboard-text", path: "/tests/report" },
      { title: "Logs", icon: "mdi-file-document", path: "/tests/logs" }
    ];
  }
}
</script>
