import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Kept apart from vite.config.ts (docs site) and vite.lib.config.ts (package)
// so a test run never writes into dist/.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
