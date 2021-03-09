import { parentPort } from "worker_threads";
const backstop = require("backstopjs");

if (parentPort) {
  parentPort.on("message", (msg) => {
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
