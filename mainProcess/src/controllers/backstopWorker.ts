import { parentPort } from "worker_threads";
const backstop = require("backstopjs");

if (parentPort) {
  parentPort.on("message", (msg) => {
    // hack to overwrite working directory in worker thread, because backstop relies on process.cwd()
    process.cwd = () => msg.workingPath;
    const command = msg.command;
    const options = msg.options;

    backstop(command, options)
      .then((...args: any[]) => {
        if (parentPort) {
          parentPort.postMessage({
            success: true,
            arguments: args
          });
        }
      }).catch((...args: any[]) => {
        if (parentPort) {
          parentPort.postMessage({
            success: false,
            arguments: args
          });
        }
      });
  });
}
