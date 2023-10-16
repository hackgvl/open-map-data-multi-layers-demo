import ContributionButton from "../../src/components/ContributionButton.vue";

describe("<ContributionButton />", () => {
  it("Renders", () => {
    // see: https://on.cypress.io/mounting-vue
    cy.mount(ContributionButton);
  });
});
