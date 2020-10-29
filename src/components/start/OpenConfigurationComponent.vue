<template>
  <v-container
    class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-card class="elevation-8">
        <v-card-title>Welcome to LEMU!</v-card-title>
        <v-card-text class="open-file-starter">
            <div>
            <p>
            To start open a BackstopJS tests configuration file ("backstop.json")
            </p>
            <v-btn large color="primary" v-on:click="openSearchFileModal">
            Open backstop.json file...
            </v-btn>
            Or
            <v-btn large color="primary" @click="createNewConfig">
              Create new config...
            </v-btn> 
          </div>
          <div>
            <h1 class="v-card__title">Recently opened</h1>
            <p v-if="recentlyOpened.length === 0">
              No config opened recently.
            </p>
            <p v-for="path in recentlyOpened" :key="path">
              <a href="#" @click="openSpecificConfig(path)">{{path}}</a>
            </p>
          </div>
        </v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Action, Mutation } from "vuex-class";
import {DialogFileService} from "../../services/dialogFileService";

@Component({
    name: "open-configuration-component"
})
export default class OpenConfigurationComponent extends Vue {
  @Action("configurationStore/openConfiguration")
  private readonly openConfiguration!: () => Promise<any>;
  @Action("configurationStore/openConfigurationFromPath")
  private readonly openConfigurationFromPath!: (path: string) => Promise<any>;
  @Action("configurationStore/initConfig")
  private readonly initTests!: () => Promise<void>;
  @Action("applicationStore/displaySnackbar")
  private readonly displaySnackbar!: (payload: {text: string, success: boolean}) => void;

  private recentlyOpened: string[];

  constructor() {
    super(arguments);

    this.recentlyOpened = [];
  }

  private created() {
    try {
      this.recentlyOpened = JSON.parse(localStorage.getItem("recentlyOpened") || "");
    } catch (e) {
      console.log("fail to open recent path");
    }
  }

  private createNewConfig() {
    this.initTests()
      .then(() => {
        this.$router.push("/tests/generalConfig");
      }).catch((error) => {
        if (!(error instanceof Error) || !error.message.endsWith("dismiss")) {
          this.displaySnackbar({text: "Failed to open file. " + error, success: false});
        }
      });
  }

  private openSearchFileModal() {
    this.openConfiguration()
      .then((fileContent) => {
        this.$router.push("/tests/generalConfig");
      }).catch((error) => {
        if (!(error instanceof Error) || !error.message.endsWith("dismiss")) {
          this.displaySnackbar({text: "Failed to open file. " + error, success: false});
        }
      });
  }

  private openSpecificConfig(path: string) {
    this.openConfigurationFromPath(path)
      .then((fileContent) => {
        this.$router.push("/tests/generalConfig");
      }).catch((error) => {
        if (!(error instanceof Error) || !error.message.endsWith("dismiss")) {
          this.displaySnackbar({text: "Failed to open file. " + error, success: false});
        }
      });
  }
}
</script>