import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Library build for npm. The docs site keeps using vite.config.ts.
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    // No .map in the tarball: it was 54 kB of the 33 kB package (gzip 13 kB)
    // and only DevTools reads it. Re-enable when debugging a consumer report.
    sourcemap: false,
    // Keep the woff2 files on disk instead of base64-inlining them into the CSS.
    assetsInlineLimit: 0,
    lib: {
      entry: "src/index.ts",
      formats: ["es"],
      fileName: () => "night-city-ui.js",
      cssFileName: "style",
    },
    rollupOptions: {
      external: ["react", "react-dom", "react-dom/client", "react/jsx-runtime"],
    },
  },
});
