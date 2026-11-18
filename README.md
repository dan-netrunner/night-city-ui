# Night City UI

[![License: MIT](https://img.shields.io/badge/license-MIT-22c55e.svg)](./LICENSE)
[![Deploy site](https://github.com/dan-netrunner/night-city-ui/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/dan-netrunner/night-city-ui/actions/workflows/deploy-pages.yml)
[![Publish to npm](https://github.com/dan-netrunner/night-city-ui/actions/workflows/publish-npm.yml/badge.svg)](https://github.com/dan-netrunner/night-city-ui/actions/workflows/publish-npm.yml)
[![npm version](https://img.shields.io/npm/v/night-city-ui.svg)](https://www.npmjs.com/package/night-city-ui)
[![CI](https://github.com/dan-netrunner/night-city-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/dan-netrunner/night-city-ui/actions/workflows/ci.yml)
[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/dan-netrunner/night-city-ui/badge)](https://scorecard.dev/viewer/?uri=github.com/dan-netrunner/night-city-ui)
[![React 18+](https://img.shields.io/badge/React-%E2%89%A518-61dafb.svg)](https://react.dev)
[![Types included](https://img.shields.io/badge/TypeScript-types%20included-3178c6.svg)](https://www.typescriptlang.org)

React + TypeScript component kit with four switchable skins: **Scrap//Tech**, **Tacky//Futurism**, **Corpo//Brutalism** and **Hyper//Opulence**. Semantic markup, CSS custom properties, no runtime dependencies beyond React.

**Docs:** [Overview](https://dan-netrunner.github.io/night-city-ui/) · [Components](https://dan-netrunner.github.io/night-city-ui/#/components) · [Guide](https://dan-netrunner.github.io/night-city-ui/#/guide) · [Guía ES](./GUIA_DE_USO.md) · [npm](https://www.npmjs.com/package/night-city-ui)

## Install

```bash
npm install night-city-ui
```

```tsx
import "night-city-ui/style.css";
import { Button, Panel, ThemeProvider } from "night-city-ui";
```

React ≥18. No font files are bundled — the CSS falls back to system fonts. For the intended look install the `@fontsource` families you want (see the Guide).

## Development

```bash
npm install
npm run dev        # docs site with hot reload
npm test           # vitest suite for the kit and the theme provider
npm run build      # type-check + build the docs site
npm run build:lib  # build the npm package into dist/
npm run preview    # serve the production build
```

## Contributing

Fork it, branch off `main`, open a pull request. Layout, conventions and the review checklist are in [CONTRIBUTING.md](./CONTRIBUTING.md); behaviour changes belong in [CHANGELOG.md](./CHANGELOG.md).

## Security

Report vulnerabilities privately — see [SECURITY.md](./SECURITY.md). Supply-chain posture: zero runtime dependencies, lockfile committed, dependency install scripts allow-listed, releases published from GitHub Actions with npm provenance and OIDC trusted publishing.

## Releasing

- **Site:** merging to `main` builds and deploys to `gh-pages` → https://dan-netrunner.github.io/night-city-ui/
- **npm:** merging to `main` publishes `package.json`'s version (skipped when that version already exists). Run `npm version patch|minor|major` before merging, and push the tag it creates. Auth is OIDC trusted publishing — no token secret. One-time setup: on npmjs.com → package → Settings → Trusted Publisher, add GitHub Actions with repo `dan-netrunner/night-city-ui`, workflow `publish-npm.yml`, environment `npm`, and allow `npm publish`; then set Publishing access to "Require 2FA and disallow tokens". If the publish still gets staged, approve it with `npm stage list night-city-ui` and `npm stage approve <stage-id>`.
- **GitHub Release:** pushing a `v*` tag attaches the tarball and opens the release.

## Credits

Night City UI React Component, Inspired by the work called "Cyberpunk 2077—User Interface" by Vladimír Vilimovský.

Independent fan project. Not affiliated with or endorsed by CD Projekt Red or Vladimír Vilimovský; no game assets, logos or fonts are included. Cyberpunk 2077 is a trademark of CD Projekt Red.

## License

[MIT](./LICENSE).
