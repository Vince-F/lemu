import { parentPort } from "worker_threads";
const backstop = require("backstopjs");

parentPort.on("message", (msg) => {
  const command = msg.command;
  const options = msg.options;

  backstop(command, options)
    .then((...args: any[]) => {
      parentPort.postMessage({
        success: true,
        arguments: args
      });
    }).catch((...args: any[]) => {
      parentPort.postMessage({
        success: false,
        arguments: args
      });
    });
});
