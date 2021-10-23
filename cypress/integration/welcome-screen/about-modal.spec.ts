import { fillWindowObject } from "../../helpers/windowHelper";

describe("About modal", () => {
  beforeEach(() => {
    cy.viewport(1920, 1080);
    cy.visit("/", {
      onBeforeLoad(win) {
        fillWindowObject(win);
      }
    });
  });

  afterEach(() => {
    delete window.ipcHandler;
  });

  it("displays about modal", () => {
    cy.get("[data-more-button]").click();
    cy.get("[data-about-button]").click();
    cy.matchImageSnapshot();
  });
});
