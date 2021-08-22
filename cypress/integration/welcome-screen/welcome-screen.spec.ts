describe("Welcome screen", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.viewport(1920, 1080);
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
});