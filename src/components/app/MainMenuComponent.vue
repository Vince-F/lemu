<template>
  <div class="menu">
    <v-navigation-drawer permanent :mini-variant="retracted">
      <v-btn text @click="toggleRetracted">
        <v-icon v-if="retracted">mdi-chevron-right</v-icon>
        <v-icon v-else>mdi-chevron-left</v-icon>
        <span v-if="!retracted">Hide menu</span>
      </v-btn>
      <v-list
        nav
      >
        <v-list-item-group color="primary">
          <v-list-item
            v-for="menu in menus"
            :key="menu.title"
            link
            :to="menu.path"
          >
            <v-list-item-icon>
              <v-icon>{{ menu.icon }}</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ menu.title }}</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";

@Component({
    name: "main-menu-component"
})
export default class MainMenuComponent extends Vue {
  private menus: Array<{title: string, icon: string, path: string}>;
  private retracted: boolean;

  constructor() {
    super(arguments);
    this.retracted = false;
    this.menus = [
      {title: "General configuration", icon: "mdi-settings", path: "/tests/generalConfig"},
      {title: "Tests", icon: "mdi-bug", path: "/tests/list"},
      {title: "Custom scripts", icon: "mdi-script", path: "/tests/customScripts"},
      {title: "Reports", icon: "mdi-clipboard-text", path: "/tests/report"},
    ];
  }

  private toggleRetracted() {
    this.retracted = !this.retracted;
  }
}
</script>