describe("Map", () => {
  function loadMap(path: string) {
    cy.intercept("https://*.tile.openstreetmap.org/**", {
      fixture: "images/tile.png",
    }).as("tiles");
    cy.intercept("https://data.openupstate.org/rest/maps?_format=json", {
      fixture: "maps.json",
    }).as("mapsList");

    cy.visit(path);

    cy.wait(["@mapsList", "@tiles"]);

    cy.url()
      .should("contain", "lat=")
      .should("contain", "lng=")
      .should("contain", "zoom=");
  }

  function waitForLayer(func: Function) {
    cy.intercept("https://data.openupstate.org/**", {
      fixture: "art-galleries.json",
    }).as("layer");

    func();

    cy.wait("@layer");
  }

  it("adds a map layer and changes URL", () => {
    loadMap("/");

    waitForLayer(() => {
      cy.get("[title='Layers']").trigger("mouseover");
      cy.get(".leaflet-control-layers-overlays label input").click();
    });

    cy.url().should("contain", "maps=");
  });

  it("unchecks a map layer and changes URL", () => {
    waitForLayer(() => {
      loadMap("/?maps=art-galleries");
      cy.get("[title='Layers']").trigger("mouseover");
      cy.get(".leaflet-control-layers-overlays label input[checked]").click();
    });

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

  describe("Attribution Control", () => {
    it("Attribution control displays the proper message and link", () => {
      loadMap("/");

      cy.get(".leaflet-control-attribution").contains(
        "Brought to you by HackGreenville Labs. Click here to contribute!",
      );

      // Get contribution link and ensure that the URL is as expected
      cy.get(
        ".leaflet-control-container > div.leaflet-bottom.leaflet-right > div > a:nth-child(2)",
      )
        .should("have.attr", "href")
        .and("match", /https:\/\/data.openupstate.org\/contribute/);
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

      // Map name appears
      cy.contains("Art Galleries");

      // Contribution link appears
      cy.contains("Contribute")
        .should("have.attr", "href")
        .and(
          "match",
          /https:\/\/docs.google.com\/spreadsheets\/d\/1I_T4Pgx6HgPo2NDP41e_k5eny8bnE29hHrZzl92VY1M\/edit#gid=0/,
        );

      // User with a provided uri appears as a link
      cy.contains("Walker Reed")
        .should("have.attr", "href")
        .and("match", /https:\/\/github.com\/walkreed/);

      //  User without a provided uri appears as plain text
      cy.contains("Shy Guy").should("not.have.attr", "href");
    });

    it("The Maintainer Control disappears if all layers are unchecked", () => {
      loadMap("/?maps=art-galleries");
      cy.get("[title='Maintainers']").should("exist");

      // Disable the art galleries layer
      cy.get("[title='Layers']").trigger("mouseover");
      cy.get(".leaflet-control-layers-overlays label input[checked]").click();

      // Maintainer control should not be visible any longer
      cy.get("[title='Maintainers']").should("not.exist");
    });
  });
});
