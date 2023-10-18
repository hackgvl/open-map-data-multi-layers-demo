describe("About page", () => {
  it("displays information after navigating to tab", () => {
    cy.visit("/");

    cy.contains("About").click();

    cy.contains("Upstate / Greenville SC Open Data Map Layers Demo");
  });

  it("displays information on first load", () => {
    cy.visit("/about");

    cy.contains("Upstate / Greenville SC Open Data Map Layers Demo");
  });
});
