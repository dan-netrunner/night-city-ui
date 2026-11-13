import { useState, type CSSProperties } from "react";
import {
  Alert,
  Badge,
  Button,
  CodeBlock,
  Input,
  Panel,
  Progress,
} from "../components";
import { useTheme } from "../theme";
import { PageHead } from "./PageHead";

const SETUP_SNIPPET = `import "./styles/tokens.css";
import "./styles/ui.css";
import { ThemeProvider } from "./theme";
import { Button, Panel, Progress, Badge } from "./components";

export function App() {
  return (
    <ThemeProvider>
      <Panel kicker="// SYS.01" title="Terminal" telemetry="LINK: OK" accent>
        <Badge tone="ok" pulse>Online</Badge>
        <Progress label="RAM deck" value={75} segmented />
        <Button code="01">Engage</Button>
      </Panel>
    </ThemeProvider>
  );
}`;

const SCOPED_THEME_SNIPPET = `import { useTheme } from "./theme";

// 1) Cambiar tema global con useTheme()
const { theme, setTheme } = useTheme();
setTheme("kitsch");

// 2) O aplicar un tema distinto solo a una sección:
<section data-theme="neomilitarism">
  <Panel title="Tactical HUD">
    <Button>Deploy</Button>
  </Panel>
</section>`;

const TOKEN_ROWS = [
  { token: "--bg / --bg-2", role: "Fondo principal y secundario del viewport" },
  { token: "--panel / --panel-2", role: "Superficie de paneles, tarjetas y modales" },
  { token: "--ink / --ink-dim / --ink-faint", role: "Texto principal, secundario y micro-etiquetas" },
  { token: "--line / --line-strong", role: "Bordes base y bordes enfatizados" },
  { token: "--accent / --accent-2", role: "Color principal neón y acento secundario" },
  { token: "--accent-ink", role: "Color de texto sobre botones o badges con fondo --accent" },
  { token: "--accent-ghost", role: "Fondo translúcido para hover y estados activos" },
  { token: "--ok / --warn / --danger", role: "Estados semánticos (junto a --ok-ink, --warn-ink, --danger-ink)" },
  { token: "--glow / --focus-glow", role: "Resplandor neón y anillo de foco accesible" },
];

export function GuidePage() {
  const { meta } = useTheme();
  const [accent, setAccent] = useState("#00f0ff");
  const [accentInk, setAccentInk] = useState("#041214");
  const [panelBg, setPanelBg] = useState("#121a2c");
  const [accent2, setAccent2] = useState("#fcee0a");

  const customCss = `[data-theme="custom"] {
  --accent: ${accent};
  --accent-2: ${accent2};
  --accent-ink: ${accentInk};
  --accent-ghost: color-mix(in oklch, ${accent} 14%, transparent);
  --panel: ${panelBg};
  --glow: 0 0 18px color-mix(in oklch, ${accent} 32%, transparent);
}`;

  const previewStyle = {
    "--accent": accent,
    "--accent-2": accent2,
    "--accent-ink": accentInk,
    "--accent-ghost": `color-mix(in oklch, ${accent} 14%, transparent)`,
    "--panel": panelBg,
    "--glow": `0 0 18px color-mix(in oklch, ${accent} 32%, transparent)`,
  } as CSSProperties;

  return (
    <div className="page">
      <PageHead
        eyebrow="Documentation // v2.0.7.7"
        title="Usage & color guide"
        lead="How to integrate Night City UI in React, switch between the four skins, and customize CSS color tokens live."
      >
        <Badge tone="accent" solid>
          Active: {meta.name}
        </Badge>
      </PageHead>

      <div className="comp-grid">
        <Panel
          className="span-6"
          kicker="// 01 quickstart"
          title="Wrap your app"
          telemetry="REACT // TS"
        >
          <div className="demo-stack">
            <p className="muted">
              Import <code>tokens.css</code> and <code>ui.css</code>, wrap your root with{" "}
              <code>ThemeProvider</code>, and import any component from{" "}
              <code>src/components</code>.
            </p>
            <CodeBlock code={SETUP_SNIPPET} label="TSX // APP.TSX" />
          </div>
        </Panel>

        <Panel
          className="span-6"
          kicker="// 02 theming"
          title="Switch or scope themes"
          telemetry="4 SKINS"
        >
          <div className="demo-stack">
            <p className="muted">
              Use <code>useTheme()</code> to change the global skin (persisted in{" "}
              <code>localStorage</code>) or pass <code>data-theme</code> to any subtree.
            </p>
            <CodeBlock code={SCOPED_THEME_SNIPPET} label="TSX // THEME SWITCH" />
          </div>
        </Panel>

        <Panel
          className="span-12"
          kicker="// 03 live color lab"
          title="Customize colors & export CSS"
          telemetry="TOKENS.CSS"
          accent
        >
          <div className="docs-grid">
            <div className="demo-stack">
              <p className="muted">
                All components read CSS custom properties from <code>src/styles/tokens.css</code>.
                Adjust the tokens below to preview a custom palette and copy the CSS block.
              </p>

              <div className="demo-grid">
                <label className="cp-field">
                  <span className="cp-field__label">--accent</span>
                  <div className="guide-color-row">
                    <input
                      type="color"
                      aria-label="Accent color"
                      value={accent}
                      onChange={(e) => setAccent(e.target.value)}
                    />
                    <Input
                      aria-label="Accent hex"
                      value={accent}
                      onChange={(e) => setAccent(e.target.value)}
                    />
                  </div>
                </label>

                <label className="cp-field">
                  <span className="cp-field__label">--accent-2</span>
                  <div className="guide-color-row">
                    <input
                      type="color"
                      aria-label="Secondary accent color"
                      value={accent2}
                      onChange={(e) => setAccent2(e.target.value)}
                    />
                    <Input
                      aria-label="Secondary accent hex"
                      value={accent2}
                      onChange={(e) => setAccent2(e.target.value)}
                    />
                  </div>
                </label>

                <label className="cp-field">
                  <span className="cp-field__label">--accent-ink</span>
                  <div className="guide-color-row">
                    <input
                      type="color"
                      aria-label="Accent ink color"
                      value={accentInk}
                      onChange={(e) => setAccentInk(e.target.value)}
                    />
                    <Input
                      aria-label="Accent ink hex"
                      value={accentInk}
                      onChange={(e) => setAccentInk(e.target.value)}
                    />
                  </div>
                </label>

                <label className="cp-field">
                  <span className="cp-field__label">--panel</span>
                  <div className="guide-color-row">
                    <input
                      type="color"
                      aria-label="Panel background color"
                      value={panelBg}
                      onChange={(e) => setPanelBg(e.target.value)}
                    />
                    <Input
                      aria-label="Panel background hex"
                      value={panelBg}
                      onChange={(e) => setPanelBg(e.target.value)}
                    />
                  </div>
                </label>
              </div>

              <CodeBlock code={customCss} label="CSS // CUSTOM THEME" />
            </div>

            <div className="demo-stack" style={previewStyle}>
              <Panel
                kicker="// LIVE OVERRIDE"
                title="Custom skin preview"
                telemetry="CUSTOM"
                accent
                actions={<Badge tone="accent" pulse>Linked</Badge>}
              >
                <div className="demo-stack">
                  <Progress label="Neural buffer" value={78} segmented />
                  <div className="demo-row">
                    <Button code="01">Primary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                  </div>
                  <Alert tone="info" title="Contrast tip">
                    Keep <code>--accent-ink</code> dark on bright neons so button labels stay crisp.
                  </Alert>
                </div>
              </Panel>
            </div>
          </div>
        </Panel>

        <Panel
          className="span-12"
          kicker="// 04 token reference"
          title="Color variables in tokens.css"
          flush
        >
          <div className="cp-table-wrap">
            <table className="cp-table">
              <thead>
                <tr>
                  <th>Variable</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {TOKEN_ROWS.map((row) => (
                  <tr key={row.token}>
                    <td>
                      <code>{row.token}</code>
                    </td>
                    <td>{row.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>
    </div>
  );
}
