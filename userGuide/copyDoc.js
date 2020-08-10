const fs = require("fs");
const fsExtra = require("fs-extra");
const path = require("path");

if (fs.existsSync(path.join(__dirname, "../dist-app/docs"))) {
  fs.rmdirSync(path.join(__dirname, "../dist-app/docs"), {recursive: true});
}
fs.mkdirSync(path.join(__dirname, "../dist-app/docs"));
fsExtra.copy(path.join(__dirname, "./docs/.vuepress/dist/"), path.join(__dirname, "../dist-app/docs"));