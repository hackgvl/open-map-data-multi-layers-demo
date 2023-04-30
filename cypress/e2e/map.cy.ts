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
});
