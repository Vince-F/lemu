<template>
    <div class="menu">
      <v-navigation-drawer permanent>
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
    name: "test-configuration-menu-component"
})
export default class TestConfigurationMenuComponent extends Vue {
  private menus: Array<{title: string, icon: string, path: string}>;

  constructor() {
    super(arguments);

    this.menus = [
      {title: "General configuration", icon: "mdi-settings", path: "/tests/generalConfig"},
      {title: "Tests", icon: "mdi-bug", path: "/tests/list"}
    ];
  }
}
</script>