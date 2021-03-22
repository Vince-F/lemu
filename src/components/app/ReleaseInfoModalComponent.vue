<template>
  <v-dialog v-model="dialogDisplayed" max-width="400">
    <v-card>
      <v-progress-circular
          indeterminate
          color="primary"
          :size="30"
          :width="3"
          v-if="loading"
        ></v-progress-circular>
      <v-card-title v-if="appInfos" class="headline">
        Changelog {{appInfos.appVersion}}
      </v-card-title>

      <v-card-text>
        
        <div v-if="appInfos && changelog">
          <p>Your LEMU has been updated to version {{appInfos.appVersion}}</p>
          <p>Here is what has changed</p>
          <div v-html="changelog"></div>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          color="grey darken-1"
          text
          @click="dismiss"
        >
          close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog> 
</template>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { State, Action } from "vuex-class";
import marked from "marked";

@Component({})
export default class AboutModalComponent extends Vue {
  @State((state) => state.applicationStore.appInfos)
  private readonly appInfos!: {appVersion: string, backstopVersion: string} | null;
  @Action("applicationStore/retrieveAppInfos")
  private readonly retrieveAppInfos!: () => Promise<void>;
  @Action("applicationStore/retrieveChangelog")
  private readonly retrieveChangelog!: (version: string) => Promise<string>;

  private dialogDisplayed: boolean = true;
  private loading: boolean;
  private changelog: string;

  constructor() {
    super(arguments);
    this.dialogDisplayed = true;
    this.loading = true;
    this.changelog = "";
  }

  private mounted() {
    this.retrieveAppInfos()
      .then(() => {
        if (this.appInfos?.appVersion) {
          this.retrieveChangelog(this.appInfos?.appVersion)
            .then((changelog) => {
              this.changelog = marked(changelog);
            });
        }
      })
      .finally(() => {
        this.loading = false;
      });
  }

  private dismiss() {
    this.dialogDisplayed = false;
    this.$emit("dismiss");
  }
}
</script>