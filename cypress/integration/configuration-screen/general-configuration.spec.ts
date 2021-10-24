import { fillWindowObject } from "../../helpers/windowHelper";
import { fillStore, navigateInApp } from "../../helpers/appHelper";

describe("General configuration", () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    delete window.ipcHandler;
    cy.visit("/", {
      onBeforeLoad(win) {
        fillWindowObject(win);
      }
    });
    cy.fixture("basicBackstop.json")
      .then((backstopObj) => {
        fillStore("configurationStore", "setFullConfiguration", backstopObj);
      });
    navigateInApp("/tests/generalConfig");
  });

  it("should display the general configuration page", () => {
    cy.matchImageSnapshot();
  });
});
