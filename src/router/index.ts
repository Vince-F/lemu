import Vue from 'vue';
import VueRouter from 'vue-router';
import StartScreenView from "../views/StartScreenView.vue";
import TestsConfigurationView from "../views/TestsConfigurationView.vue";
import ReportView from "../views/ReportView.vue";
import LogsView from "../views/LogsView.vue";
import ScriptView from "../views/ScriptView.vue";

import GeneralConfigurationComponent from "../components/generalConfig/GeneralConfigurationComponent.vue";
import TestsListComponent from "../components/tests/TestsListComponent.vue";
import TestViewComponent from "../components/tests/TestViewComponent.vue";
import TestWelcomeScreenComponent from "../components/tests/TestWelcomeScreenComponent.vue";
import ScriptViewComponent from "../components/scripts/ScriptViewComponent.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'startScreen',
    component: StartScreenView,
  },
  {
    path: '/tests',
    name: 'testConfiguration',
    component: TestsConfigurationView,
    children: [
      {
        path: "generalConfig",
        name: "generalConfiguration",
        component: GeneralConfigurationComponent
      },
      {
        path: "list",
        component: TestsListComponent,
        children: [
          {
            path: "",
            name: "tests.welcome",
            component: TestWelcomeScreenComponent
          },
          {
            path: "test/:index",
            name: "tests.view",
            component: TestViewComponent
          }
        ]
      },
      {
        path: "report",
        name: "report",
        component: ReportView
      },
      {
        path: "logs",
        name: "logs",
        component: LogsView
      },
      {
        path: "engineScripts",
        name: "engineScripts",
        component: ScriptView,
        children: [
          {
            path: ":path",
            name: "scriptView",
            component: ScriptViewComponent
          }
        ]
      }
    ]
  }
];

const router = new VueRouter({
  routes
});

export default router;
