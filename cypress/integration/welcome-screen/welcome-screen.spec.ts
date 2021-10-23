import { fillWindowObject } from "../../helpers/windowHelper";

describe("Welcome screen", () => {
  beforeEach(() => {
    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.setItem("recentlyOpened", JSON.stringify([]));
        fillWindowObject(win);
      }
    });
    cy.viewport(1920, 1080);
  });

  afterEach(() => {
    delete window.ipcHandler;
  });

  it("displays welcome screen without any recent opened", () => {
    cy.document().its("fonts.status").should("equal", "loaded"); // wait for font
    cy.get("[data-start-view]").matchImageSnapshot();
  });

  it("displays welcome screen with 5 recent opened", () => {
    const recentPaths = [
      "test1",
      "test2",
      "test3",
      "test4",
      "test5"
    ];
    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.setItem("recentlyOpened", JSON.stringify(recentPaths));
        fillWindowObject(win);
      }
    });
    cy.document().its("fonts.status").should("equal", "loaded"); // wait for font
    cy.get("[data-recently-opened]").matchImageSnapshot();
  });

  it("displays changelog when a new version has been installed and changelog has not yet been displayed", ()=> {
    cy.intercept("https://api.github.com/repos/vince-f/lemu/releases/tags/v1.2.4", {
      body: {
        body: "test"
      }
    }).as("changelogRequest");
    cy.visit("/", {
      onBeforeLoad(win) {
        fillWindowObject(win);
        win.ipcHandler.invoke = (channel: string, ...args: any[]) => {
          return Promise.resolve({
            appVersion: "1.2.4",
            backstopVersion: "4.5.6"
          });
        };
      }
    });
    cy.get("[data-release-info-modal]");
    cy.wait("@changelogRequest");
    cy.get("[data-changelog-content]");
    cy.document().its("fonts.status").should("equal", "loaded"); // wait for font
    cy.get("[data-release-info-modal-content]").matchImageSnapshot();
  });
});
