import js from "@eslint/js";
import pluginCypress from "eslint-plugin-cypress/flat";
import pluginVue from "eslint-plugin-vue";
import vueTsEslintConfig from "@vue/eslint-config-typescript";
import prettierConfig from "@vue/eslint-config-prettier";

export default [
  { ignores: ["*.d.ts", "**/coverage", "**/dist", "**/cypress/support"] },
  js.configs.recommended,
  ...pluginVue.configs["flat/essential"],
  ...vueTsEslintConfig(),
  prettierConfig,
  pluginCypress.configs.recommended,
  {
    files: [
      "src/**/*.cjs",
      "src/**/*.js",
      "src/**/*.jsx",
      "src/**/*.mjs",
      "src/**/*.mts",
      "src/**/*.ts",
      "src/**/*.tsx",
      "src/**/*.vue",
    ],
    languageOptions: {
      parserOptions: {
        ecmaVersion: "latest",
      },
    },
    rules: {
      "cypress/no-unnecessary-waiting": "off",
    },
  },
];
