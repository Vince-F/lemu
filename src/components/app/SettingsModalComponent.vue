<template>
  <v-dialog v-model="dialogDisplayed" max-width="400">
    <v-card>
      <v-card-title class="headline">
        Settings
      </v-card-title>
      <v-card-text>
        <v-switch :input-value="darkModeEnabled" @change="updateDarkMode($event)" label="Dark mode"/>
        <v-switch :input-value="autoUpdate" @change="updateAutoUpdate($event)" label="Auto update"/>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey darken-1" text @click="dismiss"> Close </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { State, Action } from "vuex-class";

@Component({})
export default class AboutModalComponent extends Vue {
  @State((state) => state.settingsStore.darkModeEnabled)
  private readonly darkModeEnabled!: boolean;

  @State((state) => state.settingsStore.autoUpdate)
  private readonly autoUpdate!: boolean;

  @Action("settingsStore/updateDarkMode")
  private readonly updateDarkMode!: (newVal: boolean) => Promise<void>;

  @Action("settingsStore/updateAutoUpdate")
  private readonly updateAutoUpdate!: (newVal: boolean) => Promise<void>;

  private dialogDisplayed = true;

  constructor() {
    super(arguments);
    this.dialogDisplayed = true;
  }

  private dismiss() {
    this.dialogDisplayed = false;
    this.$emit("dismiss");
  }
}
</script>
