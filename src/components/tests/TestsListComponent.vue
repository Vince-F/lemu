<template>
  <v-container fluid class="container pa-0">
    <div class="menu">
      <v-navigation-drawer permanent ref="leftMenu">
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>
              TESTS
            </v-list-item-title>
            <div class="action text-right">
              <v-btn color="primary" @click="addScenario">
                <v-icon>mdi-plus</v-icon>Add
              </v-btn>
            </div>    
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
                      <v-list-item-title @click="duplicateScenario(index)">
                        <v-icon color="grey lighten-1">mdi-content-copy</v-icon>
                        Duplicate
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title @click="deleteTest(index)">
                        <v-icon color="grey lighten-1">mdi-delete</v-icon>
                        Delete
                      </v-list-item-title>
                    </v-list-item>
                  </v-list>
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
      </v-navigation-drawer>
    </div>
    <router-view class="content" />
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
</style>

<script lang="ts">
import { Vue, Component, Watch } from "vue-property-decorator";
import { Getter, Mutation, Action, State } from "vuex-class";
import { BackstopTest } from "../../models/backstopTest";
import TestViewComponent from "./TestViewComponent.vue";
import { ModalService } from "../../services/modalService";
import { BackstopTestResult } from '../../models/backstopTestResult';

@Component({
  name: "tests-list-component",
  components: {
    TestViewComponent
  }
})
export default class TestsListComponent extends Vue {
  @State((state) => state.testResultStore.resultExpired)
  private readonly resultExpired!: boolean;
  @Mutation("configurationStore/addScenario")
  private readonly addScenario!: () => void;
  @Mutation("configurationStore/duplicateScenario")
  private readonly duplicateScenario!: (scenarioIndex: number) => void;
  @Mutation("configurationStore/removeScenario")
  private readonly removeScenario!: (scenarioIndex: number) => void;
  @Getter("configurationStore/tests")
  private readonly tests!: BackstopTest[];
  @Getter("configurationStore/hasTestBeenModified")
  private readonly hasTestBeenModified!: (idx: number) => boolean;
  @Getter("testResultStore/getResultByTestLabel")
  private readonly getResultByTestLabel!: (labelName: string) => BackstopTestResult[];
  @Action("configurationStore/approveTest")
  private readonly approveTest!: (testLabel: string) => Promise<void>;
  @Action("testRunnerStore/runTest")
  private readonly runTest!: (testLabel: string) => Promise<any>;
  @Action("testResultStore/retrieveTestsResult")
  private readonly retrieveTestsResult!: () => Promise<void>;

  private filter: {testStatus: string[], name: string};
  private testStatusValues: string[];

  constructor() {
    super(arguments);
    this.testStatusValues = ["pass", "failed", "unknown"];
    this.filter = {
      testStatus: this.testStatusValues.slice(),
      name: ""
    };
  }

  private mounted() {
    this.setMenuResizable();
    this.retrieveTestsResult();
  }

  private get filterModified() {
    return this.filter.name.length > 0
      || this.filter.testStatus.length !== this.testStatusValues.length;
  }

  private get filteredTests() {
    return this.tests.filter((test) => {
      return test.label.includes(this.filter.name)
        && this.filter.testStatus.includes(this.getTestStatus(test.label));
    });
  }

  private clearFilter() {
    this.filter.name = "";
    this.filter.testStatus = this.testStatusValues.slice();
  }

  private deleteTest(testIndex: number) {
    ModalService.launchConfirmationModal()
      .then(() => {
        this.removeScenario(testIndex);
        this.$router.push("/tests/list");
      });
  }

  private getTestStatus(testLabel: string) {
    const testResults = this.getResultByTestLabel(testLabel);
    let status = 'unknown';
    testResults.forEach((result) => {
      if (result.status === "pass" && status === "unknown") {
        status = "pass";
      } else if (result.status !== "pass") {
        status = 'failed';
      }
    });
    return status;
  }

  private openTestDetails(testIndex: number) {
    this.$router.push(`/tests/list/test/${testIndex}`);
  }

  private setMenuResizable() {
    const menuComponent = this.$refs.leftMenu;
    if (menuComponent instanceof Vue) {
      const menuElem = (menuComponent as Vue).$el;
      if (menuElem instanceof HTMLElement) {
        const menuPosition = menuElem.getBoundingClientRect();
        const borderElem = menuElem.querySelector(".v-navigation-drawer__border");

        if (borderElem instanceof HTMLElement) {
          borderElem.style.cursor = "ew-resize";
          borderElem.style.width = "2px";
          function resize(e: MouseEvent) {
            document.body.style.cursor = "ew-resize";
            let width = e.clientX - menuPosition.left;
            width = width < 150 ? 150 : width;
            (menuElem as HTMLElement).style.width = width + "px";
          }

          borderElem.addEventListener("mousedown", (e) => {
            menuElem.style.transition = "initial";
            document.addEventListener("mousemove", resize, false);
          }, false);

          document.addEventListener("mouseup", () => {
            menuElem.style.transition = "";
            document.body.style.cursor = "";
            document.removeEventListener("mousemove", resize, false);
          }, false);
        }
      }
    }
  }

  @Watch('resultExpired')
  private updateTestResult() {
    this.retrieveTestsResult();
  }
}
</script>