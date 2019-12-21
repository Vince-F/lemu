<template>
  <v-container
    class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-card class="elevation-8">
        <v-card-title>Welcome to LEMU!</v-card-title>
        <v-card-text class="open-file-starter">
          <p>
          To start open a BackstopJS tests configuration file ("backstop.json")
          </p>
          <v-btn large color="primary" v-on:click="openSearchFileModal">
          Open backstop.json file...
          </v-btn>
        </v-card-text>
      </v-card>
    </v-row>
    
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Action } from "vuex-class";
import {DialogFileService} from "../services/dialogFileService";

@Component({
    name: "open-configuration-component"
})
export default class OpenConfigurationComponent extends Vue {
  @Action("configurationStore/openConfiguration")
  private openConfiguration!: () => Promise<any>;

  private openSearchFileModal() {
    this.openConfiguration()
      .then((fileContent) => {
        this.$router.push("/tests/generalConfig");
      }).catch((error) => {
        if (typeof error !== "string" || error !== "dismiss") {
          // handle error here
        }
      });
  }
}
</script>