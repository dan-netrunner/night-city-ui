# Night City UI

[![License: MIT](https://img.shields.io/badge/license-MIT-22c55e.svg)](./LICENSE)
[![Deploy site](https://github.com/dan-netrunner/night-city-ui/actions/workflows/deploy-pages.yml/badge.svg)](https://github.com/dan-netrunner/night-city-ui/actions/workflows/deploy-pages.yml)
[![Publish to npm](https://github.com/dan-netrunner/night-city-ui/actions/workflows/publish-npm.yml/badge.svg)](https://github.com/dan-netrunner/night-city-ui/actions/workflows/publish-npm.yml)
[![npm version](https://img.shields.io/npm/v/night-city-ui.svg)](https://www.npmjs.com/package/night-city-ui)
[![React 18+](https://img.shields.io/badge/React-%E2%89%A518-61dafb.svg)](https://react.dev)
[![Types included](https://img.shields.io/badge/TypeScript-types%20included-3178c6.svg)](https://www.typescriptlang.org)

A React + TypeScript component kit inspired by the four design languages of Cyberpunk 2077: **Scrap//Tech**, **Tacky//Futurism**, **Corpo//Brutalism** and **Hyper//Opulence**.

One component contract, four skins, zero UI dependencies. Every component is semantic markup plus CSS custom properties, so a theme changes color, type, radius, borders, shadows and texture without touching structure.

> 📖 **Guía en español:** [GUIA_DE_USO.md](./GUIA_DE_USO.md) — integración, temas y recetas de color.

- **Live demo:** https://dan-netrunner.github.io/night-city-ui/
- **Repository:** https://github.com/dan-netrunner/night-city-ui
- **npm:** `npm install night-city-ui`
- **License:** [MIT](./LICENSE) — free for personal and commercial use.

---

## Features

- **4 live themes** driven by `data-theme` and CSS custom properties.
- **28 exported components** plus styled tables and documentation layout helpers.
- **Accessible defaults:** native controls, visible focus rings, ARIA tabs, a real `<dialog>`, keyboard-operable accordions and tooltips.
- **No runtime dependencies** beyond React and React DOM.
- **ESM + TypeScript types** built for bundlers, with the stylesheet shipped as `night-city-ui/style.css`.
- **Interactive docs:** component workbench, live color lab, theme comparison and a full operator dashboard playground.
- **GitHub Pages ready** with relative asset paths and a deploy workflow.

---

## Requirements

- React 18 or newer (peer dependency; the docs site is built with React 19)
- Node.js 20 or newer and npm 10 or newer, only to run or build this repository

---

## Install

```bash
npm install night-city-ui
```

Then import the stylesheet once, and components anywhere:

```tsx
import "night-city-ui/style.css";
import { Button, Panel, ThemeProvider } from "night-city-ui";
```

`night-city-ui` ships ESM (`dist/night-city-ui.js`) and TypeScript declarations (`dist/index.d.ts`). It does not bundle fonts — see [Fonts](#fonts).

---

## Run the docs site locally

```bash
git clone git@github.com:dan-netrunner/night-city-ui.git
cd night-city-ui
npm install
npm run dev
```

The dev server prints a local URL (Vite default: `http://localhost:5173`). Other scripts:

```bash
npm run build       # type-check with tsc and build the docs site into dist/
npm run build:lib   # build the npm package (bundle + types) into dist/
npm run preview     # serve the production build locally
```


---

## Minimal setup

```tsx
import "night-city-ui/style.css";
import { Badge, Button, Panel, Progress, ThemeProvider } from "night-city-ui";

export function App() {
  return (
    <ThemeProvider>
      <Panel
        kicker="// SYS.01"
        title="Terminal"
        telemetry="LINK: OK"
        accent
      >
        <Badge tone="ok" pulse>
          Online
        </Badge>
        <Progress label="RAM deck" value={75} segmented />
        <Button code="01">Engage</Button>
      </Panel>
    </ThemeProvider>
  );
}
```

`ThemeProvider` writes `data-theme` on `<html>`, persists the choice in `localStorage` (`nc-theme`) and applies the saved theme before first paint to avoid a flash.

### Fonts

The stylesheet references these families, with system fallbacks:

| Token | Family |
| --- | --- |
| `--font-display` / `--font-ui` / `--font-body` | Rajdhani, Orbitron, Bungee, Bebas Neue (per theme) |
| `--font-mono` | Share Tech Mono |

The kit does not bundle the font files. For the intended look, add the ones you need — this is exactly what the docs site does:

```bash
npm install @fontsource/rajdhani @fontsource/bebas-neue @fontsource/bungee @fontsource/orbitron @fontsource/share-tech-mono
```

```ts
import "@fontsource/rajdhani/400.css";
import "@fontsource/rajdhani/500.css";
import "@fontsource/rajdhani/600.css";
import "@fontsource/rajdhani/700.css";
import "@fontsource/bebas-neue/400.css";
import "@fontsource/bungee/400.css";
import "@fontsource/orbitron/500.css";
import "@fontsource/orbitron/700.css";
import "@fontsource/share-tech-mono/400.css";
```

Without them the components still work and fall back to the system sans/mono stack.

---

## Theming

### Switch skins globally

```tsx
import { useTheme } from "night-city-ui";

function ThemeMenu() {
  const { theme, setTheme, meta } = useTheme();
  return (
    <button onClick={() => setTheme("kitsch")}>
      {meta.name} → Tacky//Futurism
    </button>
  );
}
```

Available ids (used in `data-theme`): `neokitsch` (Hyper//Opulence, default), `entropism` (Scrap//Tech), `kitsch` (Tacky//Futurism), `neomilitarism` (Corpo//Brutalism).

### Scope a skin to a subtree

`data-theme` is a plain attribute, so any section can run a different skin:

```tsx
<section data-theme="neomilitarism">
  <Panel title="Tactical HUD">
    <Button>Deploy</Button>
  </Panel>
</section>
```

### Create a custom theme

All components read variables from the bundled `tokens.css`. Override the ones you need:

```css
[data-theme="custom"] {
  --accent: #00f0ff;
  --accent-2: #fcee0a;
  --accent-ink: #041214;
  --accent-ghost: color-mix(in oklch, #00f0ff 14%, transparent);
  --panel: #121a2c;
  --glow: 0 0 18px color-mix(in oklch, #00f0ff 32%, transparent);
}
```

| Token | Role |
| --- | --- |
| `--bg`, `--bg-2` | Viewport background |
| `--panel`, `--panel-2` | Panels, cards, modals |
| `--ink`, `--ink-dim`, `--ink-faint` | Primary, secondary and micro-label text |
| `--line`, `--line-strong` | Base and emphasized borders |
| `--accent`, `--accent-2` | Neon accent and secondary accent |
| `--accent-ink` | Text color on `--accent` fills |
| `--accent-ghost` | Translucent hover/active fill |
| `--ok`, `--warn`, `--danger` (+ `*-ink`) | Semantic states |
| `--glow`, `--focus-glow` | Neon glow and focus ring |
| `--radius*`, `--border-w` | Corner and border treatment |
| `--clip-panel`, `--clip-btn`, `--clip-tab`, `--clip-mark` | Cut-corner silhouettes |
| `--font-display`, `--font-ui`, `--font-body`, `--font-mono` | Type system |
| `--page-bg`, `--bar-bg`, `--noise-opacity` | Page texture, header bar and grain |

A live color lab on the **Guide** page generates the CSS block for you.

---

## Components

Import everything from one entry point:

```tsx
import { Button, Panel, ToastStack } from "night-city-ui";
```

### Actions and surfaces

| Component | Key props |
| --- | --- |
| `Button` | `variant`: `primary` \| `ghost` \| `outline` \| `danger`; `size`: `sm` \| `md` \| `lg`; `block`; `code` (HUD micro-tag) |
| `Panel` | `title`, `kicker`, `actions`, `footer`, `telemetry` (corner stamp), `accent`, `flush` |
| `Divider` | `label` (renders a labeled rule) |
| `EmptyState` | `title`, `children`, `glyph`, `action` |
| `Metric` | `label`, `value`, `unit`, `delta`, `tone`: `accent` \| `ok` \| `warn` \| `danger` |

### Forms

| Component | Key props |
| --- | --- |
| `Input` | `label`, `hint`, `error` + all `<input>` attributes |
| `Textarea` | Same as `Input`, plus `rows` (default `4`) |
| `Select` | `label`, `hint`, `error`; options as children |
| `Checkbox` | `label`, `hint`, `defaultChecked` |
| `Radio` | `label`, `hint`, `name`, `value`; group with the same `name` |
| `Toggle` | `label`, `hint`; renders a switch |
| `Slider` | `label`, `value`, `defaultValue`, `min`, `max`, `suffix`, `onChange` |

```tsx
<fieldset>
  <Radio name="route" label="Rooftop" defaultChecked />
  <Radio name="route" label="Freight elevator" />
</fieldset>
```

### Feedback

| Component | Key props |
| --- | --- |
| `Alert` | `tone`: `info` \| `ok` \| `warn` \| `danger`; `title`; `onDismiss` |
| `Badge` | `tone`: `neutral` \| `accent` \| `ok` \| `warn` \| `danger`; `solid`; `pulse` |
| `Progress` | `value`, `max`, `label`, `showValue`, `segmented`, `segments`, `tone` |
| `Tooltip` | `label`, `side`: `top` \| `bottom`; child must be focusable |
| `Toast` | `title`, `tone`, `onDismiss` |
| `ToastStack` | `items: ToastItem[]`, `onDismiss(id)`, `label` |
| `Spinner` | `label`, `size`: `sm` \| `md` \| `lg` |
| `Skeleton` | `width`, `height` |

```tsx
const [toasts, setToasts] = useState<ToastItem[]>([]);

<ToastStack
  items={toasts}
  onDismiss={(id) => setToasts((list) => list.filter((t) => t.id !== id))}
/>
```

### Navigation and disclosure

| Component | Key props |
| --- | --- |
| `Tabs` | `items: { id, label, count? }[]`, `value`, `onChange`, `label` |
| `Accordion` | `items: { id, title, meta?, children }[]`, `defaultOpen` |
| `Breadcrumbs` | `items: { label, href? }[]`, `label` |
| `Pagination` | `page`, `pageCount`, `onChange`, `label` |
| `Modal` | `open`, `onClose`, `title`, `kicker`, `footer` |

`Tabs` supports arrow-key navigation. `Modal` wraps a native `<dialog>` and gets the focus trap, `Esc` handling and backdrop for free. `Accordion` uses `<details>`/`<summary>` and needs no JavaScript.

### Content

| Component | Key props |
| --- | --- |
| `Avatar` | `name`, `src`, `status`: `online` \| `busy` \| `offline`, `size` |
| `Kbd` | `children` |
| `CodeBlock` | `code`, `label`; includes a copy button |
| `Table` | CSS only: wrap in `.cp-table-wrap` and add `.cp-table` to `<table>` |

`Avatar` derives initials from `name` when no `src` is given and exposes the full name through `aria-label`.

---

## Accessibility notes

- Focus rings use `--focus-glow` and never rely on color alone.
- `Tabs` uses `role="tablist"`/`role="tab"`, roving `tabIndex` and Arrow keys.
- `Tooltip` attaches `aria-describedby` to the trigger; wrap a real control.
- Toasts use `role="status"` (or `role="alert"` for danger) so they are announced.
- `prefers-reduced-motion` disables shimmer, pulse and spin animations.
- Decorative textures, status dots and glyphs are `aria-hidden`.

---

## Project structure

```
src/
  components/     # one file per component group + index.ts barrel
  pages/          # demo: Overview, Components, Playground, Themes, Guide
  styles/
    tokens.css    # design tokens and the four themes
    ui.css        # component styles
    app.css       # demo site layout only
  index.ts        # package entry: styles + public exports
  theme.tsx       # ThemeProvider + useTheme
  App.tsx         # hash router + shell
  data.ts         # demo data
vite.lib.config.ts  # library build (npm package)
tsconfig.lib.json   # declaration emit
```

Demo pages are not part of the component API; they are only exported by the docs site, never by the package entry.

---

## Publishing

### npm

`.github/workflows/publish-npm.yml` runs on every push or merge to `main` and with manual dispatch. It installs, runs `npm publish` (which triggers `prepublishOnly` → `npm run build:lib`) and publishes with provenance.

Setup, once:

1. Create the repository secret **`NPM_SECRET`** for the **environment `npm`** (Settings → Environments → `npm` → Environment secrets). Use an npm **automation** token or a granular token with read/write on `night-city-ui`.
2. Keep `package.json` `name`, `version` and `repository` in sync.

Then bump the version to ship:

```bash
npm version patch   # or minor / major
git push            # merge to main publishes the new version
```

If `package.json` still has a version that already exists on npm, the workflow skips the publish and reports it, so merges without a bump stay green.

Publishing locally is also possible:

```bash
npm login
npm publish --access public
```

### GitHub Pages

The workflow at `.github/workflows/deploy-pages.yml` builds the docs site into `dist/` with `npm run build` on every push or merge to `main` and force-pushes it to the **`gh-pages`** branch. `base: "./"` in `vite.config.ts` keeps asset paths relative, so the site works from the repository subpath.

1. Push the repository to GitHub.
2. Open **Settings → Pages → Build and deployment**.
3. Set **Source** to **Deploy from a branch**, branch **`gh-pages`**, folder **`/` (root)**.
4. Push to `main` (or run the workflow manually from **Actions**). The first run creates `gh-pages`; if the branch is not listed yet, run the workflow once and reload the Pages settings.

Expected URL: `https://dan-netrunner.github.io/night-city-ui/`.

The workflow is intentionally triggered by `main`, not by `gh-pages`: the action writes `dist/` to `gh-pages`, so triggering on that branch would redeploy on its own output. `main` stays the source of truth and `gh-pages` is only the published artifact.

<details>
<summary>Alternative: deploy with a GitHub Actions artifact</summary>

If you prefer not to keep a `gh-pages` branch, replace the workflow with the standard `actions/upload-pages-artifact` + `actions/deploy-pages` pair and set **Settings → Pages → Source** to **GitHub Actions**. In that model `main` is both the source and the deployment trigger, and no branch is written.
</details>

---

## License

[MIT](./LICENSE). Use it, fork it, sell it — keep the copyright notice.

This is an independent fan project. It is not affiliated with or endorsed by CD Projekt Red, and it ships no game assets, logos, characters or fonts owned by them. Cyberpunk 2077 is a trademark of CD Projekt Red.
