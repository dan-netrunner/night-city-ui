# Architecture

The high-level design of **night-city-ui**: what the pieces are, which direction they may
depend on, and how source becomes the published artifact. For what each component does see
[COMPONENTS.md](./COMPONENTS.md); for the trust boundary see
[SECURITY_MODEL.md](./SECURITY_MODEL.md).

## Layers

```text
src/styles/tokens.css   design tokens, one block per skin        (no selectors of its own)
src/styles/ui.css       component styles, keyed to the tokens    (classes only)
        ↓ imported by
src/components/*.tsx    presentational + behaviour, no styling   (never import CSS)
src/theme.tsx           ThemeProvider / useTheme, the skin switch
        ↓ re-exported by
src/index.ts            the package entry — the public API
```

Dependency direction is one-way, top to bottom. A component never imports CSS, never imports
`src/pages`, and never imports `ComponentWorkbench`; the entry is the only module that joins
styles and components. That is what lets the same component render under four skins without a
rebuild.

## Theming

A skin is a block of CSS custom properties scoped to `[data-theme="…"]` in
[`src/styles/tokens.css`](../src/styles/tokens.css): `:root` carries `neokitsch`, and
`entropism`, `kitsch` and `neomilitarism` override the same names. Component rules in `ui.css` take their colour from those
variables — 440 `var(--…)` uses against 36 hex literals and 47 `rgb()`/`hsl()` calls, the latter
almost all shadows, scrims and the four `[data-theme="…"]` blocks in `ui.css` for the effects a
token cannot express. Switching a skin is switching one attribute.

[`src/theme.tsx`](../src/theme.tsx) owns the client side of that:

- `ThemeProvider` seeds its state from `document.documentElement.dataset.theme` when the server
  or the host page has already set one, and falls back to `neokitsch` for any unknown value.
- `setTheme(id)` writes `document.documentElement.dataset.theme`, updates the
  `meta[name="theme-color"]` tag with the skin's background, and persists the id under the
  `nc-theme` key. The `localStorage` call is wrapped in `try`/`catch`: in private mode the theme
  still applies for the session, it just does not survive a reload.
- `useTheme()` throws when used outside the provider rather than returning a partial context.

There is no CSS-in-JS and no runtime stylesheet injection. Theme state is component state; no
global store, no side-channel.

## Two builds from one source tree

| | docs site + demo | the published library |
| --- | --- | --- |
| config | [`vite.config.ts`](../vite.config.ts) | [`vite.lib.config.ts`](../vite.lib.config.ts) |
| command | `tsc --noEmit && vite build` | `vite build --config vite.lib.config.ts`, then `tsc -p tsconfig.lib.json` for the declarations |
| entry | `src/main.tsx` → `src/App.tsx` + `src/pages/*` | `src/index.ts` |
| output | `dist/` chunks for GitHub Pages | `dist/night-city-ui.js` (ESM), `dist/style.css`, `.d.ts` |
| ships in npm | no | yes |

The library build sets `lib.formats: ["es"]` and keeps `react`, `react-dom`, `react-dom/client`
and `react/jsx-runtime` external, so the bundle carries no copy of React. `sourcemap` is off —
dropping the `.map` files took the packed tarball from 33.2 kB to 23.9 kB, and only DevTools reads
them — and `assetsInlineLimit` is `0`, so any asset the entry pulls in stays a separate file
instead of being base64-inlined into the CSS. Today that means no fonts at all: the
`@fontsource` faces are imported by `src/main.tsx`, the docs-site entry, never by `src/index.ts` —
the package ships the CSS `font-family` stacks and leaves the faces to the application, which is
the "Fonts" note in the README. Both builds write to `dist/`, so the last one to run owns the
directory; the `files` allow-list in `package.json` is what keeps a docs-site chunk out of the
tarball.

## Public surface

`src/index.ts` re-exports `src/components/index.ts` and `src/theme.tsx`. Anything not reachable
from there is internal, `ComponentWorkbench` included — it exists to demo the kit on the docs
site and is excluded from coverage for the same reason. The package has **zero runtime
dependencies** and declares `react`/`react-dom` `>=18` as peers.

## Verification

`src/**/*.test.tsx` runs on Vitest + `@testing-library/react` + jsdom: `kit.test.tsx` for roles,
labels, ARIA wiring and behaviour, `theme.test.tsx` for the provider and the persistence path,
`progress.property.test.tsx` as a `fast-check` property test. `npm run test:coverage` instruments
`src/components/*.tsx` and `src/theme.tsx` only — the shipped surface — and CI fails the required
`build` check below the thresholds in `vitest.config.ts`.

The build is repeatable from a clean checkout. Measured on 2026-11-18: two consecutive
`npm run build:lib` runs, with `dist/` deleted between them, produced 16 files with identical
sha256 per file — `night-city-ui.js`, `style.css`, the 13 declaration files and `favicon.svg`
(copied from `public/`). Same lockfile, same toolchain, same machine — that is the scope of what
was checked; it is not a claim of hermetic, cross-machine reproducibility, which the badge grades
separately as `build_reproducible`.
