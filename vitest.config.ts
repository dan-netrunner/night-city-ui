import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Kept apart from vite.config.ts (docs site) and vite.lib.config.ts (package)
// so a test run never writes into dist/.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      reportsDirectory: "coverage",
      // The shipped surface only: the docs-site pages and the demo workbench are
      // not part of the package and would only dilute the number.
      include: ["src/components/**/*.tsx", "src/theme.tsx"],
      exclude: ["src/components/ComponentWorkbench.tsx", "src/**/*.test.tsx"],
      // Measured on 2026-11-18: 93% statements / 84% branches / 92% functions.
      // The floor is the OpenSSF "80% statement coverage" criterion, with margin.
      thresholds: { statements: 90, branches: 80, functions: 85, lines: 90 },
    },
  },
});
