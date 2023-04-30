/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
declare global {
  namespace Cypress {
    interface Chainable {
      scrollLeaflet(opts: WheelEventOptions): Chainable<Element>;
      panLeaflet(opts: PanLeafletOptions): Chainable<Element>;
    }

    interface WheelEventOptions {
      deltaX?: number;
      deltaY?: number;
    }

    interface PanLeafletOptions {
      deltaX?: number;
      deltaY?: number;
    }
  }
}

Cypress.Commands.add(
  "scrollLeaflet",
  { prevSubject: "element" },
  ($el: JQuery<HTMLElement>, opts) => {
    cy.log("scrolling leaflet", opts);

    requestAnimationFrame(() => {
      $el.get(0).dispatchEvent(new WheelEvent("wheel", opts));
    });
  }
);

Cypress.Commands.add(
  "panLeaflet",
  { prevSubject: "element" },
  ($el: JQuery<HTMLElement>, { deltaX = 0, deltaY = 0 }) => {
    const leaflet = $el.get(0);
    const leafletBounds = leaflet.getBoundingClientRect();
    const center = {
      x: leafletBounds.left + leafletBounds.width / 2,
      y: leafletBounds.top + leafletBounds.height / 2,
    };

    cy.log("panning leaflet", { deltaX, deltaY });

    leaflet.dispatchEvent(
      new MouseEvent("mousedown", {
        clientX: center.x,
        clientY: center.y,
      })
    );

    leaflet.dispatchEvent(
      new MouseEvent("mousemove", {
        clientX: center.x + deltaX,
        clientY: center.y + deltaY,
        bubbles: true,
      })
    );

    requestAnimationFrame(() => {
      leaflet.dispatchEvent(
        new MouseEvent("mouseup", {
          clientX: center.x + deltaX,
          clientY: center.y + deltaY,
          bubbles: true,
        })
      );
    });
  }
);

export {};
