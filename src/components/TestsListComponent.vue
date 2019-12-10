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
              <v-list-item-content>
                <v-list-item-title>{{ test.label }}</v-list-item-title>
              </v-list-item-content>
              <v-list-item-action class="my-0">
                <v-btn icon>
                  <v-icon color="grey lighten-1" v-on:click="deleteTest(index)">mdi-delete</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
          </v-list-item-group>
        </v-list>
      </v-navigation-drawer>
    </div>
    <template v-if="selectedTest">
      <test-view-component :testContent="selectedTest" :testIndex="selectedIndex" class="content"></test-view-component>
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
</style>

<script lang="ts">
import { Vue, Component } from "vue-property-decorator";
import { Getter, Mutation } from "vuex-class";
import { BackstopTest } from "../models/backstopTest";
import TestViewComponent from "./TestViewComponent.vue";

@Component({
  name: "tests-list-component",
  components: {
    TestViewComponent
  }
})
export default class TestsListComponent extends Vue {
  @Mutation("configurationStore/addScenario")
  private addScenario!: Function;
  @Mutation("configurationStore/removeScenario")
  private removeScenario!: Function;
  @Getter("configurationStore/tests")
  private tests!: BackstopTest[];
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
    this.removeScenario(testIndex);
  }

  private openTestDetails(testIndex: number) {
    this.$emit("testIndexSelected", testIndex);
    this.selectedTest = this.tests[testIndex];
    this.selectedIndex = testIndex;
  }
}
</script>