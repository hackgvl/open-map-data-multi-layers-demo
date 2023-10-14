import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  return {
    build: { sourcemap: true },
    plugins: [vue()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    base: "/open-map-data-multi-layers-demo/",
    define: {
      "process.env.DATA_API_BASE_URL": JSON.stringify(
        mode === "test"
          ? "http://localhost:9090"
          : "https://data.openupstate.org",
      ),
    },
    test: {
      globalSetup: ["./src/tests/vitest.global.ts"],
    },
  };
});
