<template>
  <v-container fluid class="container pa-0">
    <div class="menu">
      <v-navigation-drawer permanent>
        <v-subheader>TESTS</v-subheader>
        <div class="action text-right">
          <v-btn color="primary" v-on:click="addTest">
            <v-icon>mdi-plus</v-icon>Add
          </v-btn>
        </div>

        <v-divider></v-divider>

        <v-list dense>
          <v-list-item-group color="primary">
            <v-list-item
              v-for="(test, index) in tests"
              :key="index"
              link
              v-on:click="openTestDetails(index)"
            >
              <v-tooltip top >
                <template v-slot:activator="{on}">
                  <v-list-item-icon class="ms-0 mr-1 small-icon" >
                    <v-icon v-if="hasTestBeenModified(index)" v-on="on" x-small color="grey">mdi-circle</v-icon>
                  </v-list-item-icon>
                </template>
                <span>This test contains unsaved changes</span>
              </v-tooltip>
              <v-list-item-content>
                <v-list-item-title >
                  {{ test.label }}
                </v-list-item-title>
              </v-list-item-content>
              <v-list-item-action class="my-0 flex-row">
                <v-tooltip top>
                  <template v-slot:activator="{on}">
                    <v-btn icon v-on="on" @click="duplicateTest(index)">
                      <v-icon color="grey lighten-1">mdi-content-copy</v-icon>
                    </v-btn>
                  </template>
                  <span>Duplicate test</span>
                </v-tooltip>
                <v-tooltip top>
                  <template v-slot:activator="{on}">
                    <v-btn icon v-on="on" @click="deleteTest(index)">
                      <v-icon color="grey lighten-1">mdi-delete</v-icon>
                    </v-btn>
                  </template>
                  <span>Remove test</span>
                </v-tooltip>
              </v-list-item-action>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
    </div>
    <template v-if="selectedTest">
      <test-view-component :testContent="selectedTest" :testIndex="selectedIndex" 
        class="content" @duplicate-test="duplicateTest" @delete-test="deleteTest"></test-view-component>
    </template>
    <v-row v-else align="center" justify="center" class="ma-0">
      <v-card>
        <v-card-title>Tests</v-card-title>
        <v-card-text>
          <p>Select a test to edit it.</p>
          <p>Or
            <v-btn color="primary" text v-on:click="addTest">
              <v-icon>mdi-plus</v-icon>Add
            </v-btn>
            a new one.
          </p>
        </v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>

<style scoped>
.action {
  padding: 8px;
}
.container {
  display: flex;
  height: 100%;
}

.menu {
  flex: 0;
  height: 100%;
}
.content {
  flex: 1;
  height: 100%;
  max-height: 100%;
  overflow: auto;
}

.v-list-item__icon.small-icon {
  min-width: 12px;
}
</style>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Getter, Mutation } from "vuex-class";
import { BackstopTest } from "../models/backstopTest";
import TestViewComponent from "./TestViewComponent.vue";
import { ModalService } from "../services/modalService";

@Component({
  name: "tests-list-component",
  components: {
    TestViewComponent
  }
})
export default class TestsListComponent extends Vue {
  @Mutation("configurationStore/addScenario")
  private addScenario!: Function;
  @Mutation("configurationStore/duplicateScenario")
  private duplicateScenario!: Function;
  @Mutation("configurationStore/removeScenario")
  private removeScenario!: Function;
  @Getter("configurationStore/tests")
  private tests!: BackstopTest[];
  @Getter("configurationStore/hasTestBeenModified")
  private hasTestBeenModified!: (idx: number) => boolean;
  private selectedTest: BackstopTest | null;
  private selectedIndex: number | null;

  constructor() {
    super(arguments);
    this.selectedTest = null;
    this.selectedIndex = null;
  }

  private addTest() {
    this.addScenario();
  }

  private deleteTest(testIndex: number) {
    ModalService.launchConfirmationModal()
      .then(() => {
        this.removeScenario(testIndex);
        this.selectedTest = null;
        this.selectedIndex = null;
      });
  }

  private duplicateTest(testIndex: number) {
    this.duplicateScenario(testIndex);
  }

  private openTestDetails(testIndex: number) {
    this.$emit("testIndexSelected", testIndex);
    this.selectedTest = this.tests[testIndex];
    this.selectedIndex = testIndex;
  }
}
</script>