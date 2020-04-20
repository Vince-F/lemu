import Vue from 'vue';
import VueRouter from 'vue-router';
import StartScreenView from "../views/StartScreenView.vue";
import TestsConfigurationView from "../views/TestsConfigurationView.vue";
import ReportView from "../views/ReportView.vue";

import GeneralConfigurationComponent from "../components/generalConfig/GeneralConfigurationComponent.vue";
import TestsListComponent from "../components/tests/TestsListComponent.vue";
import TestViewComponent from "../components/tests/TestViewComponent.vue";
import TestWelcomeScreenComponent from "../components/tests/TestWelcomeScreenComponent.vue";

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
        name: "testsList",
        component: TestsListComponent,
        children: [
          {
            path: "",
            name: "testWelcome",
            component: TestWelcomeScreenComponent
          },
          {
            path: "test/:index",
            name: "testView",
            component: TestViewComponent
          }
        ]
      },
      {
        path: "report",
        name: "report",
        component: ReportView
      }
    ]
  }
];

const router = new VueRouter({
  routes
});

export default router;
