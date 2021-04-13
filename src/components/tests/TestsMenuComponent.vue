<template>
  <div @contextmenu="showMainContextMenu">
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title class="title-with-action">
          TESTS
          <v-spacer />
          <v-btn color="primary" @click="addScenario">
            <v-icon>mdi-plus</v-icon>Add
          </v-btn>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense>
      <div class="filter-area">
        <v-menu
          offset-y
          :close-on-content-click="false"
          :nudge-width="420">
          <template v-slot:activator="{ on: menuListener, attrs }">
            <div class="d-flex">
              <div class="flex-grow-1 flex-shrink-1 filter-count text-caption">
                <span>{{filteredTests.length}}</span>
                /
                <span v-if="tests.length === 0 || tests.length === 1">{{tests.length}} test</span>
                <span v-else>{{tests.length}} tests</span>
              </div>
              <v-tooltip bottom>
                <template v-slot:activator="{ on: tooltipListener }">
                  <v-btn icon class="flex-grow-0 flex-shrink-0">
                    <v-icon v-on="{...menuListener, ...tooltipListener}" v-bind="attrs"
                      :color="filterModified? 'primary lighten-1' : 'grey lighten-1'">mdi-filter-variant</v-icon>
                  </v-btn>
                </template>
                Filter
              </v-tooltip>
            </div>
          </template>
          <v-card>
            <v-card-title>
              Filter test list
            </v-card-title>
            <v-card-text>
              <v-select
                v-model="filter.testStatus"
                :items="testStatusValues"
                chips
                label="Test status"
                multiple
                dense
              ></v-select>
              <v-text-field
                label="Test name"
                v-model="filter.name"
              ></v-text-field>
            </v-card-text>
            <v-card-actions>
              <v-btn text @click="clearFilter">Clear filter</v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </div>
      <v-list-item-group color="primary">
        <v-list-item
          v-for="(test, index) in filteredTests"
          :key="index"
          link
          v-on:click="openTestDetails(index)"
          @contextmenu="showContextMenu($event, index)"
        >
          <v-tooltip top>
            <template v-slot:activator="{on}">
              <v-list-item-icon class="ms-0 mr-1 small-icon" >
                <v-icon v-if="hasTestBeenModified(index)" v-on="on" x-small color="grey">mdi-circle</v-icon>
              </v-list-item-icon>
            </template>
            <span>This test contains unsaved changes</span>
          </v-tooltip>
          <v-list-item-content>
            <v-list-item-title>
              {{ test.label }}
            </v-list-item-title>
          </v-list-item-content>
          <v-list-item-action class="my-0 flex-row">
            <div class="icon-container">
              <v-icon color="green" v-if="getTestStatus(test.label) === 'pass'">
                mdi-check-circle
              </v-icon>
              <v-icon color="grey" v-else-if="getTestStatus(test.label) === 'unknown'">
                mdi-help-circle
              </v-icon>
              <v-icon color="red" v-else>
                mdi-alert
              </v-icon>
            </div>
            <v-menu offset-y>
              <template v-slot:activator="{ on }">
                <v-btn icon v-on.stop.prevent="on">
                  <v-icon color="grey lighten-1">mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <test-entry-menu-component :test="test" :testIndex="index" />
            </v-menu>
          </v-list-item-action>
        </v-list-item>
      </v-list-item-group>
      <v-list-item-group v-if="tests.length > 0 && filteredTests.length === 0"
          class=empty-placeholder>
        <p>No test match your filter.</p>
        <v-btn @click="clearFilter">Clear filter</v-btn>
      </v-list-item-group>
    </v-list>
    <v-menu offset-y absolute v-model="contextMenuDisplayed"
      :position-x="contextMenuX" :position-y="contextMenuY"
      >
      <test-entry-menu-component :test="tests[contextMenuTestIndex]" :testIndex="contextMenuTestIndex" />
    </v-menu>
    <v-menu offset-y absolute v-model="mainContextMenuDisplayed"
      :position-x="contextMenuX" :position-y="contextMenuY"
      >
      <v-list dense>
        <v-list-item>
          <v-list-item-title @click="addScenario">
            <v-icon color="grey lighten-1">mdi-plus</v-icon>
            Add test
          </v-list-item-title>
        </v-list-item>
        <v-list-item>
          <v-list-item-title v-if="!testRunning" @click="runBackstopTests">
            <v-icon color="grey lighten-1">mdi-play</v-icon>
            Run all tests
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </div>
</template>

<style scoped>
.action {
  padding: 8px;
}

.v-list-item__icon.small-icon {
  min-width: 12px;
}

.icon-container {
  height: 100%;
  display: flex;
}

.filter-area {
  padding-left: 30px;
  padding-right: 16px;
}

.filter-count {
  padding-top: 10px;
}

.empty-placeholder {
  padding: 16px;
  text-align: center;
}

.title-with-action {
  display: flex;
  align-items: center;
}
</style>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { Getter, Mutation, Action, State } from "vuex-class";
import { BackstopTest } from "../../models/backstopTest";
import { BackstopTestResult } from "../../models/backstopTestResult";
import TestEntryMenuComponent from "./TestEntryMenuComponent.vue";

@Component({
  name: "tests-menu-component",
  components: {
    TestEntryMenuComponent
  }
})
export default class TestsMenuComponent extends Vue {
  @State((state) => state.testResultStore.resultExpired)
  private readonly resultExpired!: boolean;

  @Mutation("configurationStore/addScenario")
  private readonly addScenario!: () => void;

  @Getter("configurationStore/tests")
  private readonly tests!: BackstopTest[];

  @Getter("configurationStore/hasTestBeenModified")
  private readonly hasTestBeenModified!: (idx: number) => boolean;

  @Getter("testResultStore/getResultByTestLabel")
  private readonly getResultByTestLabel!: (labelName: string) => BackstopTestResult[];

  @Action("testResultStore/retrieveTestsResult")
  private readonly retrieveTestsResult!: () => Promise<void>;

  @Action("testRunnerStore/runTests")
  private readonly runBackstopTests!: () => Promise<void>;

  @State((state) => state.testRunnerStore.testRunning)
  private readonly testRunning!: boolean;

  private filter: {testStatus: string[], name: string};
  private testStatusValues: string[];
  private contextMenuDisplayed: boolean;
  private contextMenuX: number;
  private contextMenuY: number;
  private contextMenuTestIndex: number;
  private mainContextMenuDisplayed: boolean;

  constructor() {
    super(arguments);
    this.testStatusValues = ["pass", "failed", "unknown"];
    this.filter = {
      testStatus: this.testStatusValues.slice(),
      name: ""
    };
    this.contextMenuDisplayed = false;
    this.contextMenuX = -1;
    this.contextMenuY = -1;
    this.contextMenuTestIndex = -1;
    this.mainContextMenuDisplayed = false;
  }

  private mounted() {
    this.retrieveTestsResult();
  }

  private get filterModified() {
    return this.filter.name.length > 0 ||
      this.filter.testStatus.length !== this.testStatusValues.length;
  }

  private get filteredTests() {
    return this.tests.filter((test) => {
      return test.label.includes(this.filter.name) &&
        this.filter.testStatus.includes(this.getTestStatus(test.label));
    });
  }

  private clearFilter() {
    this.filter.name = "";
    this.filter.testStatus = this.testStatusValues.slice();
  }

  private getTestStatus(testLabel: string) {
    const testResults = this.getResultByTestLabel(testLabel);
    let status = "unknown";
    testResults.forEach((result) => {
      if (result.status === "pass" && status === "unknown") {
        status = "pass";
      } else if (result.status !== "pass") {
        status = "failed";
      }
    });
    return status;
  }

  private openTestDetails(testIndex: number) {
    this.$router.push({ name: "tests.view", params: { index: "" + testIndex } });
  }

  private showContextMenu($event: MouseEvent, testIndex: number) {
    $event.preventDefault();
    $event.stopPropagation();
    this.contextMenuDisplayed = true;
    this.mainContextMenuDisplayed = false;
    this.contextMenuX = $event.clientX;
    this.contextMenuY = $event.clientY;
    this.contextMenuTestIndex = testIndex;
  }

  private showMainContextMenu($event: MouseEvent) {
    $event.preventDefault();
    $event.stopPropagation();
    this.mainContextMenuDisplayed = true;
    this.contextMenuDisplayed = false;
    this.contextMenuX = $event.clientX;
    this.contextMenuY = $event.clientY;
  }

  @Watch("resultExpired")
  private updateTestResult() {
    this.retrieveTestsResult();
  }
}
</script>
