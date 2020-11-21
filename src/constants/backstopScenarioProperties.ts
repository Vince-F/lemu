

export const backstopScenarioProperties = Object.freeze([
  {name: "onBeforeScript", type: "scripts"},
  {name: "cookiePath", type: "string"},
  {name: "referenceUrl", type: "string"},
  {name: "readyEvent", type: "string"},
  {name: "readySelector", type: "string"},
  {name: "delay", type: "number"},
  {name: "hideSelectors", type: "array"},
  {name: "removeSelectors", type: "array"},
  {name: "onReadyScript", type: "scripts"},
  {name: "keyPressSelectors", type: "array"},
  {name: "hoverSelector", type: "string"},
  {name: "hoverSelectors", type: "array"},
  {name: "clickSelector", type: "string"},
  {name: "clickSelectors", type: "array"},
  {name: "postInteractionWait", type: "string"},
  {name: "scrollToSelector", type: "string"},
  {name: "selectors", type: "array"},
  {name: "selectorExpansion", type: "boolean"},
  {name: "misMatchThreshold", type: "number"},
  {name: "requireSameDimensions", type: "boolean"},
  {name: "viewports", type: "viewports"}
]) as Array<{name: string, type: "string" | "number" | "array" | "boolean" | "scripts" | "viewports" }>;
