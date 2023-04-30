# OpenDataGVL Map

This is a Vue project which allows all you to view all of Code for Greenville's
open map data!

- View the live demo at
  [https://codeforgreenville.org/open-map-data-multi-layers-demo/](https://codeforgreenville.org/open-map-data-multi-layers-demo/)

- Visit [the OpenData Github
  repo](https://github.com/codeforgreenville/OpenData/blob/master/MAPS_API.md)
  for more information about this data.

Contributions to this project or the map data is greatly appreciated! You can
visit the [Code for Greenville](https://codeforgreenville.org) website to find
out how to get involved.

---

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) +
[Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and
disable Vetur) + [TypeScript Vue Plugin
(Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

I also recommend using [asdf version manager](https://asdf-vm.com) to install
the correct version of Node.JS for this project. Then, you can follow the
instructions to [install the Node.JS asdf
plugin](https://asdf-vm.com/guide/getting-started.html#_4-install-a-plugin), and
the Node.JS version will be installed for this directory only.

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we
replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need
[TypeScript Vue Plugin
(Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
to make the TypeScript language service aware of `.vue` types.

If the standalone TypeScript plugin doesn't feel fast enough to you, Volar has
also implemented a [Take Over
Mode](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669)
that is more performant. You can enable it by the following steps:

1. Disable the built-in TypeScript Extension
   1. Run `Extensions: Show Built-in Extensions` from VSCode's command palette
   2. Find `TypeScript and JavaScript Language Features`, right click and select
      `Disable (Workspace)`
2. Reload the VSCode window by running `Developer: Reload Window` from the
   command palette.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit:dev
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server. It is much
faster than the production build.

### Run all tests:

This will run all unit and end to end tests, as well as type and formatting
checks in preparation for a pull request:

```sh
npm run test:all
```

### Lint with [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/)

This will format all the files for you automatically!

```sh
npm run lint
```

---

`stable`:

[![run-tests](https://github.com/codeforgreenville/open-map-data-multi-layers-demo/actions/workflows/run-tests.yml/badge.svg?branch=stable)](https://github.com/codeforgreenville/open-map-data-multi-layers-demo/actions/workflows/run-tests.yml)

`develop`:

[![run-tests](https://github.com/codeforgreenville/open-map-data-multi-layers-demo/actions/workflows/run-tests.yml/badge.svg?branch=develop)](https://github.com/codeforgreenville/open-map-data-multi-layers-demo/actions/workflows/run-tests.yml)
