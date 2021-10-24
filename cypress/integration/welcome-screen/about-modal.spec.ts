import { fillWindowObject } from "../../helpers/windowHelper";

describe("About modal", () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    delete window.ipcHandler;
    cy.visit("/", {
      onBeforeLoad(win) {
        fillWindowObject(win);
      }
    });
  });

  it("displays about modal", () => {
    cy.get("[data-more-button]").click();
    cy.get("[data-about-button]").click();
    cy.matchImageSnapshot();
  });
});
