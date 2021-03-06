import Vue from "vue";
import VueRouter from "vue-router";
import StartScreenView from "../views/StartScreenView.vue";
import TestsConfigurationView from "../views/TestsConfigurationView.vue";
import ReportView from "../views/ReportView.vue";
import LogsView from "../views/LogsView.vue";
import ScriptView from "../views/ScriptView.vue";
import TestView from "../views/TestView.vue";

import ConfigurationComponent from "../components/generalConfig/ConfigurationComponent.vue";
import TestViewComponent from "../components/tests/TestViewComponent.vue";
import TestWelcomeScreenComponent from "../components/tests/TestWelcomeScreenComponent.vue";
import ScriptViewComponent from "../components/scripts/ScriptViewComponent.vue";

import TemplatesView from "../views/TemplatesView.vue";
import TemplateContentView from "../views/TemplateContentView.vue";
import TemplateScriptsMenuComponent from "../components/templates/scripts/TemplateScriptsMenuComponent.vue";
import TemplateScriptViewComponent from "../components/templates/scripts/TemplateScriptViewComponent.vue";
import TemplateScriptWelcomeComponent from "../components/templates/scripts/TemplateScriptWelcomeComponent.vue";
import TemplateConfigurationsMenuComponent from "../components/templates/configuration/TemplateConfigurationsMenuComponent.vue";
import TemplateConfigurationViewComponent from "../components/templates/configuration/TemplateConfigurationViewComponent.vue";
import TemplateConfigurationWelcomeComponent from "../components/templates/configuration/TemplateConfigurationWelcomeComponent.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "startScreen",
    component: StartScreenView
  },
  {
    path: "/tests",
    name: "testConfiguration",
    component: TestsConfigurationView,
    children: [
      {
        path: "generalConfig",
        name: "generalConfiguration",
        component: ConfigurationComponent
      },
      {
        path: "list",
        component: TestView,
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
        path: "test/:index/fullscren",
        name: "test.fullscreenView",
        component: TestViewComponent
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
  },
  {
    path: "/templates",
    name: "templates",
    component: TemplatesView,
    children: [
      {
        path: "script",
        component: TemplateContentView,
        children: [
          {
            path: "",
            name: "scriptTemplates.welcome",
            components: {
              menu: TemplateScriptsMenuComponent,
              view: TemplateScriptWelcomeComponent
            }
          },
          {
            path: ":name",
            name: "scriptTemplates.view",
            components: {
              menu: TemplateScriptsMenuComponent,
              view: TemplateScriptViewComponent
            }
          }
        ]
      },
      {
        path: "configuration",
        component: TemplateContentView,
        children: [
          {
            path: "",
            name: "configurationTemplates.welcome",
            components: {
              menu: TemplateConfigurationsMenuComponent,
              view: TemplateConfigurationWelcomeComponent
            }
          },
          {
            path: ":index",
            name: "configurationTemplates.view",
            components: {
              menu: TemplateConfigurationsMenuComponent,
              view: TemplateConfigurationViewComponent
            }
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
