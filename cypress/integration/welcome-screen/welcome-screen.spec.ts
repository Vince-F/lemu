describe("Welcome screen", () => {
  beforeEach(() => {
    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.setItem(`changelog_1.2.3_displayed`, true);
        win.ipcHandler = {
          send(channel: string, ...args: any[]) {
            //
          },
          sendSync(channel: string, ...args: any[]) {

          },
          receive(channel: string, callback: (...args: any[]) => void) {
            //
          },
          receiveOnce(channel: string, callback: (...args: any[]) => void) {
            //
          },
          createTitleBar() {
            //
          },
          updateTitleBarTitle(newTitle: string) {
            //
          },
          logger: {
            silly(...args: string[]) {
              //
            },
            info(...args: string[]) {
              //
            },
            warn(...args: string[]) {
              //
            },
            error(...args: string[]) {
              //
            }
          },
          invoke(channel: string, ...args: any[]) {
            if (channel === "appInfos") {
              return Promise.resolve({
                appVersion: "1.2.3",
                backstopVersion: "4.5.6"
              });
            } else {
              return Promise.resolve({});
            }
          }
        };
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
    cy.reload();
    cy.matchImageSnapshot();
  });

  it("displays changelog when a new version has been installed and changelog has not yet been displayed", ()=> {
    cy.visit("/", {
      onBeforeLoad(win) {
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
