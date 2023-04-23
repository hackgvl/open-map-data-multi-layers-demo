describe("More E2E tests", () => {
  it("Checks a filter and checks URL has changed", () => {
    let prevUrl: string;

    cy.visit("/");
    cy.url().then((url) => {
      prevUrl = url;
      cy.get("[title='Layers']").trigger("mouseover");
      cy.get(
        "label:nth-of-type(1) > span > .leaflet-control-layers-selector"
      ).click();
      cy.url().then((url) => {
        expect(url).to.not.eql(prevUrl);
      });
    });
  });

  it("Unchecks a filter and checks URL has changed", () => {
    let prevUrl: string =
      "http://localhost:4173/open-map-data-multi-layers-demo/?lat=34.844526&lng=-82.401078&zoom=10&maps=adult-day-care";

    cy.visit(prevUrl);
    cy.get("[title='Layers']").trigger("mouseover");
    cy.get(
      "label:nth-of-type(1) > span > .leaflet-control-layers-selector"
    ).click();
    cy.url().then((url) => {
      expect(url).to.not.eql(prevUrl);
    });
  });

  it("Zooms the map and checks URL has changed", () => {
    let prevUrl: string;

    cy.visit("/");
    cy.wait(1000);
    cy.url().then((url) => {
      prevUrl = url;
      cy.get("[title='Zoom in']").click();
      cy.url().then((url) => {
        expect(url).to.not.eql(prevUrl);
      });
    });
  });

  it("Unzooms the map and checks URL has changed", () => {
    let prevUrl: string;

    cy.visit("/");
    cy.wait(1000);
    cy.url().then((url) => {
      prevUrl = url;
      cy.get("[title='Zoom out']").click();
      cy.url().then((url) => {
        expect(url).to.not.eql(prevUrl);
      });
    });
  });

  it("Moves the around map and checks URL has changed", () => {
    let prevUrl: string;
    cy.visit("");
    cy.url().then((url) => {
      prevUrl = url;
      cy.get(
        ".leaflet-container.leaflet-grab.leaflet-touch.leaflet-touch-drag.leaflet-touch-zoom"
      )
        .trigger("mousedown", { which: 1 })
        .trigger("mousemove", { clientX: 400, clientY: 500 })
        .trigger("mouseup", { force: true })
        .wait(1000)
        .trigger("mousedown", { which: 1 })
        .trigger("mousemove", { clientX: 400, clientY: 500 })
        .trigger("mouseup", { force: true })
        .wait(1000);
      cy.url().then((url) => {
        expect(url).to.not.eql(prevUrl);
      });
    });
  });
});
