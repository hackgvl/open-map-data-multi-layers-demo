import { describe, it, expect } from "vitest";
import { setActivePinia, createPinia } from "pinia";
import { useUIStore } from "../../stores/ui";

describe("uiStore", () => {
  const primeTheStore = (initBannerVisibility: boolean | null) => {
    if (initBannerVisibility !== null) {
      sessionStorage.setItem(
        "disableHGLabsMapBanner",
        initBannerVisibility.toString(),
      );
    }

    setActivePinia(createPinia());
  };

  it("Upon first visit showContributionBanner is true", () => {
    primeTheStore(null);

    const uiStore = useUIStore();
    expect(uiStore.showContributionBanner).toStrictEqual(true);
  });

  it("User closes the banner", () => {
    primeTheStore(null);
    expect(sessionStorage.getItem("disableHGLabsMapBanner")).toStrictEqual(
      null,
    );

    const uiStore = useUIStore();
    //Action triggered once someone closes the banner
    uiStore.setShowContributionBanner(false);

    expect(sessionStorage.getItem("disableHGLabsMapBanner")).toStrictEqual(
      "false",
    );
    expect(uiStore.showContributionBanner).toStrictEqual(false);
  });

  it("User reloads page after previously closing banner in session", () => {
    primeTheStore(false);

    const uiStore = useUIStore();

    expect(sessionStorage.getItem("disableHGLabsMapBanner")).toStrictEqual(
      "false",
    );
    expect(uiStore.showContributionBanner).toStrictEqual(false);
  });
});
