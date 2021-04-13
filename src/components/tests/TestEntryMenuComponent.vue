<template>
  <v-list dense>
    <v-list-item>
      <v-list-item-title @click="runTest(test.label)">
        <v-icon color="grey lighten-1">mdi-play</v-icon>
        Run
      </v-list-item-title>
    </v-list-item>
    <v-list-item>
      <v-list-item-title @click="approveTest(test.label)">
        <v-icon color="grey lighten-1">mdi-check-circle</v-icon>
        Approve
      </v-list-item-title>
    </v-list-item>
    <v-list-item>
      <v-list-item-title @click="duplicateScenario(testIndex)">
        <v-icon color="grey lighten-1">mdi-content-copy</v-icon>
        Duplicate
      </v-list-item-title>
    </v-list-item>
    <v-list-item>
      <v-list-item-title @click="deleteTest(testIndex)">
        <v-icon color="grey lighten-1">mdi-delete</v-icon>
        Delete
      </v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { BackstopConfiguration } from "@/models/backstopConfiguration";
import { Vue, Component, Prop } from "vue-property-decorator";
import { Mutation, Action } from "vuex-class";
import { ModalService } from "../../services/modalService";

@Component
export default class TestEntryMenuComponent extends Vue {
  @Prop({ required: true, type: BackstopConfiguration })
  private readonly test!: BackstopConfiguration;

  @Prop({ required: true, type: Number })
  private readonly testIndex!: number;

  @Action("configurationStore/approveTest")
  private readonly approveTest!: (testLabel: string) => Promise<void>;

  @Mutation("configurationStore/duplicateScenario")
  private readonly duplicateScenario!: (scenarioIndex: number) => void;

  @Mutation("configurationStore/removeScenario")
  private readonly removeScenario!: (scenarioIndex: number) => void;

  @Action("testRunnerStore/runTest")
  private readonly runTest!: (testLabel: string) => Promise<void>;

  private deleteTest(testIndex: number) {
    ModalService.launchConfirmationModal("Do you really wish to delete this entry?")
      .then(() => {
        this.removeScenario(testIndex);
        this.$router.push({ name: "tests.welcome" });
      });
  }
}
</script>
