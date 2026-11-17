import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
// latin subset only: the docs site is English/Spanish, and this is the only
// subset the browser ever fetches. Importing <weight>.css also ships
// latin-ext / devanagari / vietnamese files that nobody downloads.
import "@fontsource/rajdhani/latin-400.css";
import "@fontsource/rajdhani/latin-500.css";
import "@fontsource/rajdhani/latin-600.css";
import "@fontsource/rajdhani/latin-700.css";
import "@fontsource/bebas-neue/latin-400.css";
import "@fontsource/bungee/latin-400.css";
import "@fontsource/orbitron/latin-500.css";
import "@fontsource/orbitron/latin-700.css";
import "@fontsource/share-tech-mono/latin-400.css";
import "./styles/tokens.css";
import "./styles/ui.css";
import "./styles/app.css";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
