import flowbitePlugin from "flowbite/plugin";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Config from "tailwindcss";

/** @type {Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue}",
    "node_modules/flowbite-vue/**/*.{js,jsx,ts,tsx,vue}",
    "node_modules/flowbite/**/*.{js,jsx,ts,tsx,vue}",
  ],
  theme: {
    extend: {},
  },
  plugins: [flowbitePlugin],
};
