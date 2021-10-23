/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

const {
  addMatchImageSnapshotPlugin
} = require("cypress-image-snapshot/plugin");

module.exports = (on, config) => {
  addMatchImageSnapshotPlugin(on, config);
  on('before:browser:launch', (browser, launchOptions) => {
    if (browser.name === 'chrome' && browser.isHeadless) {
      launchOptions.args.push('--window-size=1920,1080');
      launchOptions.args.push('--force-device-scale-factor=1');
    }

    if (browser.name === 'electron' && browser.isHeadless) {
      launchOptions.preferences.width = 1920;
      launchOptions.preferences.height = 1080;
    }

    if (browser.name === 'firefox' && browser.isHeadless) {
      launchOptions.args.push('--width=1920');
      launchOptions.args.push('--height=1080');
    }

    return launchOptions;
  });
};
