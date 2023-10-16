describe("Contribution Banner", () => {
  const closeBanner = () => {
    cy.get(
      "#app > div > div.sticky.top-0.overflow-hidden.gap-x-6.bg-gray-800.items-center > div > span > button > svg",
    ).click();
  };

  const bannerAppears = (url: string) => {
    cy.visit(url);

    cy.contains("We're Open Source!");
    cy.contains("Click here to contribute")
      .should("have.attr", "href")
      .and("match", /https:\/\/data.openupstate.org\/map-layers/);
  };

  const bannerCanBeClosed = (url: string) => {
    cy.visit(url);

    cy.contains("Click here to contribute");

    closeBanner();

    // Banner should no longer be visible.
    cy.get("Click here to contribute").should("not.exist");
  };

  const bannerRemainsClosedAfterRefresh = (url: string) => {
    cy.visit(url);

    cy.contains("Click here to contribute");

    closeBanner();

    cy.get("Click here to contribute").should("not.exist");

    // Refresh the page
    cy.reload();

    // Banner should still not be visible.
    cy.get("Click here to contribute").should("not.exist");
  };

  describe("Map Page", () => {
    const url = "/";

    it("Banner Appears", () => bannerAppears(url));
    it("Banner Can be Closed", () => bannerCanBeClosed(url));
    it("Banner Remains Closed After Refresh", () =>
      bannerRemainsClosedAfterRefresh(url));
  });

  describe("About Page", () => {
    const url = "/about";

    it("Banner Appears", () => bannerAppears(url));
    it("Banner Can be Closed", () => bannerCanBeClosed(url));
    it("Banner Remains Closed After Refresh", () =>
      bannerRemainsClosedAfterRefresh(url));
  });
});
