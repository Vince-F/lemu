describe("About modal", () => {
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

  it("displays about modal", () => {
    cy.get("[data-more-button]").click();
    cy.get("[data-about-button]").click();
    cy.matchImageSnapshot();
  });
});