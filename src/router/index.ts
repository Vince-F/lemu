import Vue from 'vue';
import VueRouter from 'vue-router';
import StartScreenView from "../views/StartScreenView.vue";
import TestsConfigurationView from "../views/TestsConfigurationView.vue";

import GeneralConfigurationComponent from "../components/GeneralConfigurationComponent.vue";
import TestsListComponent from "../components/TestsListComponent.vue";

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
        component: TestsListComponent
      }
    ]
  }
];

const router = new VueRouter({
  routes
});

export default router;
