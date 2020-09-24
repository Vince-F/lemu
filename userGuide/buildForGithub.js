const { createApp, build } = require('vuepress');
let config = require("./docs/.vuepress/config");
const path = require("path");

config.base = "/lemu/";
const output = path.join(__dirname, "../docs");

const docApp = createApp({
  sourceDir: __dirname,
  dest: output,
  theme: "",
  siteConfig: config
});

docApp.process()
  .then(() => {
    docApp.build();
  }).catch((e) => {
    console.log(e);
    console.error("Failed to process the app");
    process.exit(1);
  });