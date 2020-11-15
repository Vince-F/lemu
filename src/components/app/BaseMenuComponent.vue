<template>
  <div class="menu">
    <v-navigation-drawer permanent :mini-variant="retracted">
      <v-tooltip right :disabled="!retracted">
        <template v-slot:activator="{ on }">
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
          <v-tooltip
            right
            v-for="menu in menus"
            :key="menu.title"
            :disabled="!retracted"
          >
            <template v-slot:activator="{ on }">
              <v-list-item v-on="on" link :to="menu.path">
                <v-list-item-icon>
                  <v-icon>{{ menu.icon }}</v-icon>
                </v-list-item-icon>

                <v-list-item-content>
                  <v-list-item-title>{{ menu.title }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </template>
            {{ menu.title }}
          </v-tooltip>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  name: "main-menu-component",
})
export default class BaseMenuComponent extends Vue {
  @Prop({ required: true, type: Array})
  private readonly menus!: Array<{ title: string; icon: string; path: string }>;

  private retracted: boolean;

  constructor() {
    super(arguments);
    this.retracted = false;
  }

  private toggleRetracted() {
    this.retracted = !this.retracted;
  }
}
</script>