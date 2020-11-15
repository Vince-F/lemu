<template>
  <base-menu-component :menus="menus" />
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import BaseMenuComponent from "../app/BaseMenuComponent.vue";

@Component({
  name: "main-menu-component",
  components: {
    BaseMenuComponent
  }
})
export default class TemplatesMenuComponent extends Vue {
  private menus: Array<{ title: string; icon: string; path: string }>;

  constructor() {
    super(arguments);
    this.menus = [
      {
        title: "Engine scripts",
        icon: "mdi-script",
        path: "/templates/script/",
      }
    ];
  }
}
</script>
