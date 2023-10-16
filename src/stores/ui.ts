import { defineStore } from "pinia";

export const useUIStore = defineStore("ui", {
  state: () => ({
    showContributionBanner:
      sessionStorage.getItem("disableHGLabsMapBanner") !== "false",
  }),
  getters: {},
  actions: {
    setShowContributionBanner(showBanner: boolean) {
      this.showContributionBanner = showBanner;

      sessionStorage.setItem("disableHGLabsMapBanner", showBanner.toString());
    },
  },
});
