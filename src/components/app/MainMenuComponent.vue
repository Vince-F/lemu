<template>
  <div class="menu">
    <v-navigation-drawer permanent :mini-variant="retracted">
      <v-tooltip right 
        :disabled="!retracted">
        <template v-slot:activator="{on}">
          <v-btn text @click="toggleRetracted" v-on="on">
            <v-icon v-if="retracted">mdi-chevron-right</v-icon>
            <v-icon v-else>mdi-chevron-left</v-icon>
            <span v-if="!retracted">Hide menu</span>
          </v-btn>
        </template>
        Expand menu
      </v-tooltip>
      <v-list nav>
        <v-list-item-group color="primary">
          <v-tooltip right 
            v-for="menu in menus"
            :key="menu.title"
            :disabled="!retracted">
            <template v-slot:activator="{on}">
              <v-list-item
                v-on="on"
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
            </template>
            {{menu.title}}
          </v-tooltip>
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
      {title: "Engine scripts", icon: "mdi-script", path: "/tests/engineScripts"},
      {title: "Reports", icon: "mdi-clipboard-text", path: "/tests/report"},
      {title: "Logs", icon: "mdi-file-document", path: "/tests/logs"},
    ];
  }

  private toggleRetracted() {
    this.retracted = !this.retracted;
  }
}
</script>