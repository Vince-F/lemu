import { backstopFieldType } from "@/models/backstopFieldType";

export const backstopScenarioProperties = Object.freeze([
  { name: "onBeforeScript", type: "scripts" },
  { name: "cookiePath", type: "string" },
  { name: "referenceUrl", type: "string" },
  { name: "readyEvent", type: "string" },
  { name: "readySelector", type: "selector" },
  { name: "delay", type: "number" },
  { name: "hideSelectors", type: "selectors" },
  { name: "removeSelectors", type: "selectors" },
  { name: "onReadyScript", type: "scripts" },
  { name: "keyPressSelectors", type: "selectors" },
  { name: "hoverSelector", type: "selector" },
  { name: "hoverSelectors", type: "selectors" },
  { name: "clickSelector", type: "selector" },
  { name: "clickSelectors", type: "selectors" },
  { name: "postInteractionWait", type: "string" },
  { name: "scrollToSelector", type: "selector" },
  { name: "selectors", type: "selectors" },
  { name: "selectorExpansion", type: "boolean" },
  { name: "misMatchThreshold", type: "number" },
  { name: "requireSameDimensions", type: "boolean" },
  { name: "viewports", type: "viewports" },
  { name: "readySelector", type: "selector" },
  { name: "readyEvent", type: "string" }
]) as Array<{name: string, type: backstopFieldType }>;
