import { fillWindowObject } from "../../helpers/windowHelper";

describe("Welcome screen", () => {
  beforeEach(() => {
    cy.visit("/", {
      onBeforeLoad(win) {
        fillWindowObject(win);
      }
    });
    cy.viewport(1920, 1080);
  });

  afterEach(() => {
    delete window.ipcHandler;
  });

  it("displays welcome screen without any recent opened", () => {
    cy.matchImageSnapshot();
  });

  it("displays welcome screen with 5 recent opened", () => {
    const recentPaths = [
      "test1",
      "test2",
      "test3",
      "test4",
      "test5"
    ];
    window.localStorage.setItem("recentlyOpened", JSON.stringify(recentPaths));
    cy.visit("/", {
      onBeforeLoad(win) {
        fillWindowObject(win);
      }
    });
    cy.matchImageSnapshot();
  });

  it("displays changelog when a new version has been installed and changelog has not yet been displayed", ()=> {
    cy.intercept("https://api.github.com/repos/vince-f/lemu/releases/tags/v1.2.4", {
      body: { 
        body: "test"
      }
    });
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
    cy.waitFor("[data-release-info-modal]");
    cy.matchImageSnapshot();
  });
});
