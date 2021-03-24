<template>
  <v-dialog v-model="dialogDisplayed" max-width="400">
    <v-card>
      <v-card-title class="headline">
        About Lemu
      </v-card-title>

      <v-card-text>
        <v-progress-circular
          indeterminate
          color="primary"
          :size="30"
          :width="3"
          v-if="loading"
        ></v-progress-circular>
        <div v-else-if="appInfos">
          <p>Version: {{ appInfos.appVersion }}</p>
          <p>Backstop version: {{ appInfos.backstopVersion }}</p>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey darken-1" text @click="dismiss"> Close </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from "vue-property-decorator";
import { State, Action } from "vuex-class";

@Component({})
export default class AboutModalComponent extends Vue {
  @State((state) => state.applicationStore.appInfos)
  private readonly appInfos!: {
    appVersion: string;
    backstopVersion: string;
  } | null;
  @Action("applicationStore/retrieveAppInfos")
  private readonly retrieveAppInfos!: () => Promise<void>;

  private dialogDisplayed: boolean = true;
  private loading: boolean;

  constructor() {
    super(arguments);
    this.dialogDisplayed = true;
    this.loading = true;
  }

  private created() {
    this.retrieveAppInfos().finally(() => {
      this.loading = false;
    });
  }

  private dismiss() {
    this.dialogDisplayed = false;
    this.$emit("dismiss");
  }
}
</script>