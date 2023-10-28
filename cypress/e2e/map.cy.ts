describe("Map", () => {
  function loadMap(path: string) {
    cy.visit(path);

    cy.url()
      .should("contain", "lat=")
      .should("contain", "lng=")
      .should("contain", "zoom=");
  }

  it("adds a map layer and changes URL", () => {
    loadMap("/");

    cy.get("[title='Layers']").trigger("mouseover");
    cy.get(".leaflet-control-layers-overlays label input").first().click();

    cy.url().should("contain", "maps=");
  });

  it("unchecks a map layer and changes URL", () => {
    loadMap("/?maps=adult-day-care");

    cy.get("[title='Layers']").trigger("mouseover");
    cy.get(".leaflet-control-layers-overlays label input[checked]").click();

    cy.url().should("not.contain", "maps=");
  });

  it("zooms the map in with zoom in button and changes URL", () => {
    loadMap("/?zoom=10");

    cy.get("[aria-label='Zoom in']").click();

    cy.url().should("contain", "zoom=11");
  });

  it("zooms the map in with scroll wheel and changes URL", () => {
    loadMap("/?zoom=10");

    cy.get(".leaflet-container").scrollLeaflet({ deltaY: -66.666666 });

    cy.url().should("contain", "zoom=11");
  });

  it("unzooms the map with zoom out button and changes URL", () => {
    loadMap("/?zoom=10");

    cy.get("[aria-label='Zoom out']").click();

    cy.url().should("contain", "zoom=9");
  });

  it("unzooms the map with scroll wheel and changes URL", () => {
    loadMap("/?zoom=10");

    cy.get(".leaflet-container").scrollLeaflet({ deltaY: 66.666666 });

    cy.url().should("contain", "zoom=9");
  });

  it("pans the map and changes latitude", () => {
    loadMap("/?lat=34.844526&lng=-82.401078");

    cy.get(".leaflet-container").panLeaflet({ deltaY: 50 });

    cy.url().should("not.contain", "lat=34.844526");
  });

  it("pans the map and changes longitude", () => {
    loadMap("/?lat=34.844526&lng=-82.401078");

    cy.get(".leaflet-container").panLeaflet({ deltaX: 50 });

    cy.url().should("not.contain", "lng=-82.401078");
  });

  it("Map contents are redisplayed whenever returning to the page from another", () => {
    loadMap("/?maps=adult-day-care");

    cy.get(".leaflet-marker-icon").its("length").as("initialNumberOfMarkers");

    // Go to the About page...
    cy.contains("About").click();
    // ... and then back to the map page.
    cy.get("nav > a:nth-child(1)").click();

    // Check that the markers are all still there
    cy.get("@initialNumberOfMarkers").then((initialCount) => {
      cy.get(".leaflet-marker-icon")
        .its("length")
        .then((newCount) => {
          expect(initialCount).to.eq(newCount);
        });
    });

    cy.url().should("contain", "maps=adult-day-care");

    // Check that the layer checkbox is still checked
    cy.get("[title='Layers']").trigger("mouseover");
    cy.get(".leaflet-control-layers-overlays label input[checked]").should(
      "have.length",
      1,
    );
  });

  describe("Attribution Control", () => {
    it("Attribution control displays the proper message", () => {
      loadMap("/");

      cy.get(".leaflet-control-attribution").contains(
        "Brought to you by HackGreenville Labs",
      );
    });
  });

  describe("Maintainer Control", () => {
    it("The Maintainer Control is NOT visible if there are no active layers", () => {
      loadMap("/");

      cy.get("[title='Maintainers']").should("not.exist");
    });

    it("The Maintainer Control is visible with active layers", () => {
      loadMap("/?maps=art-galleries");

      cy.get("[title='Maintainers']").should("exist");
      cy.get("[title='Maintainers']").trigger("mouseover");

      // Contribution button appears
      cy.contains("Learn how to contribute!")
        .parent()
        .should("have.attr", "href")
        .and("match", /https:\/\/data.openupstate.org\/map-layers/);

      // Map name appears
      cy.contains("Art Galleries");

      // Source link appears
      cy.contains("Data Source")
        .should("have.attr", "href")
        .and(
          "match",
          /https:\/\/docs.google.com\/spreadsheets\/d\/1I_T4Pgx6HgPo2NDP41e_k5eny8bnE29hHrZzl92VY1M\/edit#gid=0/,
        );

      // User with a provided uri appears as a link
      cy.contains("Walker Reed")
        .should("have.attr", "href")
        .and("match", /https:\/\/github.com\/walkreed/);
    });

    it("The Maintainer Control disappears if all layers are unchecked", () => {
      loadMap("/?maps=adult-day-care");
      cy.get("[title='Maintainers']").should("exist");

      // Disable the art galleries layer
      cy.get("[title='Layers']").trigger("mouseover");
      cy.get(".leaflet-control-layers-overlays label input[checked]").click();

      // Maintainer control should not be visible any longer
      cy.get("[title='Maintainers']").should("not.exist");
    });
  });
});
