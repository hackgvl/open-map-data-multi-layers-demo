import { setActivePinia, createPinia } from "pinia";

import ContributionBanner from "../../src/components/ContributionBanner.vue";

describe("<ContributionBanner />", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("Renders", () => {
    cy.mount(ContributionBanner);
  });
});
