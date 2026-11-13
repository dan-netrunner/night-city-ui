# Night City UI

A React + TypeScript component kit inspired by the four design languages of Cyberpunk 2077 (**Entropism**, **Kitsch**, **Neo-Militarism**, and **Neokitsch**).

## Features

- **4 live themes** driven purely by CSS custom properties (`data-theme="neokitsch" | "entropism" | "kitsch" | "neomilitarism"`).
- **14 accessible components**: `Button` (with optional HUD telemetry `code`), `Panel` (with corner `telemetry`), `Input`, `Select`, `Checkbox`, `Toggle`, `Slider`, `Tabs`, `Badge` (with `pulse` node), `Progress` (smooth or `segmented` HUD bar), `Alert`, `Modal`, `CodeBlock`, and styled `Table`.
- **Interactive Component Workbench** on the Components page to test props live and copy JSX snippets with one click.
- **Operator Playground** dashboard built exclusively from the kit.

## Local Development

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

## GitHub Pages Deployment

This repository includes a GitHub Actions workflow at `.github/workflows/deploy-pages.yml` and relative asset paths (`base: "./"` in `vite.config.ts`).

To publish on GitHub Pages:
1. Push the repository to GitHub (and merge your changes into `main`).
2. Go to **Settings → Pages → Build and deployment → Source** and select **GitHub Actions**.
3. Every push to `main` (or manual `workflow_dispatch`) will build `dist/` and deploy it to GitHub Pages.
