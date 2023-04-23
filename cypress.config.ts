import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    specPattern: "cypress/e2e/**/*.{cy,spec}.{js,jsx,ts,tsx}",
    baseUrl: "http://localhost:4173/open-map-data-multi-layers-demo/?lat=34.844526&lng=-82.401078&zoom=10",
  },
});
