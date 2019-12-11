<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Lemu Logo"
          class="shrink mr-2"
          contain
          src="./assets/icon.png"
          transition="scale-transition"
          width="40"
        />

        <h1 class="app-title">LEMU</h1>
      </div>

      <v-spacer></v-spacer>

      <v-btn text v-on:click="save" v-if="hasConfiguration">
        <v-icon>mdi-content-save</v-icon>
        Save
      </v-btn>
    </v-app-bar>

    <v-content>
      <router-view />
    </v-content>
  </v-app>
</template>

<style scoped>
  .app-title {
    font-weight: 400;
  }
</style>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import {Action, Getter} from "vuex-class";

@Component
export default class App extends Vue {
  @Action("configurationStore/saveConfiguration")
  private saveConfiguration!: () => Promise<void>;
  @Getter("configurationStore/hasConfiguration")
  private hasConfiguration!: boolean;

  private save() {
    this.saveConfiguration()
      .then(() => {
        alert("File saved");
      }).catch((error) => {
        alert(error);
      });
  }
}
</script>
