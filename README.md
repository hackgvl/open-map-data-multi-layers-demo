# Open Data Upstate / Greenville SC Map Layers Demo

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-3-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

[![All Contributors][all-contributors-logo]](#contributors-)&ensp;[![Continuous Integration](https://github.com/hackgvl/open-map-data-multi-layers-demo/actions/workflows/ci.yml/badge.svg)](https://github.com/hackgvl/open-map-data-multi-layers-demo/actions/workflows/ci.yml)

This is a Vue project which allows all you to dynamically toggle on/off any of
the [Upstate / Greenville SC open map data
layers](https://data.openupstate.org/map-layers)!

- [View the live demo](https://hackgvl.github.io/open-map-data-multi-layers-demo/?lat=34.844526&lng=-82.401078&zoom=10)
- Visit [the OpenData Github
  repo](https://github.com/hackgvl/OpenData/blob/master/MAPS_API.md)
  for more information about this data.

Contributions to this project or the map data is greatly appreciated! You can
join the [HackGreenville Slack](https://hackgreenville.com/join-slack) #hg-labs channel to get involved. Or, comment on issues or pull requests on this repository.

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

**Reset Cached API Responses (Called Tapes) Used by Vitest**
This project utilizes the [talkback](https://github.com/ijpiantanida/talkback) package to save responses received from external dependencies into fixtures (called tapes) that can be used in subsequent set suite executions.

If the upstream data source's response schema is altered you can run the following command to "freshen things up" and overwrite any previously recorded responses:

```sh
OVERWRITE_TAPES=1 npm run test:unit:dev
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

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://olivia.sculley.dev"><img src="https://avatars.githubusercontent.com/u/88074048?v=4?s=100" width="100px;" alt="Olivia Sculley"/><br /><sub><b>Olivia Sculley</b></sub></a><br /><a href="#ideas-oliviasculley" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/hackgvl/open-map-data-multi-layers-demo/commits?author=oliviasculley" title="Code">💻</a> <a href="https://github.com/hackgvl/open-map-data-multi-layers-demo/commits?author=oliviasculley" title="Tests">⚠️</a> <a href="#maintenance-oliviasculley" title="Maintenance">🚧</a> <a href="#infra-oliviasculley" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="https://github.com/hackgvl/open-map-data-multi-layers-demo/issues?q=author%3Aoliviasculley" title="Bug reports">🐛</a> <a href="https://github.com/hackgvl/open-map-data-multi-layers-demo/commits?author=oliviasculley" title="Documentation">📖</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/ThorntonMatthewD"><img src="https://avatars.githubusercontent.com/u/44626690?v=4?s=100" width="100px;" alt="Matthew Thornton"/><br /><sub><b>Matthew Thornton</b></sub></a><br /><a href="https://github.com/hackgvl/open-map-data-multi-layers-demo/commits?author=ThorntonMatthewD" title="Code">💻</a> <a href="https://github.com/hackgvl/open-map-data-multi-layers-demo/commits?author=ThorntonMatthewD" title="Tests">⚠️</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/Alex-Grimes"><img src="https://avatars.githubusercontent.com/u/66704965?v=4?s=100" width="100px;" alt="Alex Grimes"/><br /><sub><b>Alex Grimes</b></sub></a><br /><a href="https://github.com/hackgvl/open-map-data-multi-layers-demo/commits?author=Alex-Grimes" title="Code">💻</a> <a href="https://github.com/hackgvl/open-map-data-multi-layers-demo/commits?author=Alex-Grimes" title="Tests">⚠️</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
