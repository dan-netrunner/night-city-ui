import {
  Badge,
  Button,
  Input,
  Panel,
  Progress,
  Select,
  Slider,
} from "../components";
import { ROLES } from "../data";
import { THEMES, useTheme } from "../theme";
import { PageHead } from "./PageHead";

export function ThemesPage() {
  const { theme, setTheme, meta } = useTheme();

  return (
    <div className="page">
      <PageHead
        eyebrow="Design languages"
        title="Four ways to survive Night City"
        lead="The same markup rendered under four token sets. Each card below is a live subtree with its own data-theme — the site itself stays on the skin you picked."
      >
        <Badge tone="accent" solid>
          Active: {meta.name}
        </Badge>
      </PageHead>

      <div className="theme-showcase-grid">
        {THEMES.map((item, index) => {
          const active = theme === item.id;
          return (
            <section
              className="theme-showcase"
              data-theme={item.id}
              key={item.id}
              aria-label={`${item.name} theme preview`}
            >
              <div className="theme-showcase__banner">
                <div className="theme-showcase__top">
                  <span className="cp-eyebrow">
                    0{index + 1} // {item.era}
                  </span>
                  <Badge tone={active ? "ok" : "accent"} solid>
                    {active ? "Active" : "Preview"}
                  </Badge>
                </div>
                <h2>{item.name}</h2>
                <p className="theme-showcase__tagline">{item.tagline}</p>
              </div>

              <div className="theme-showcase__body">
                <p className="muted">{item.description}</p>

                <div className="swatches" aria-label={`${item.name} palette`}>
                  {item.swatches.map((color) => (
                    <span
                      key={color}
                      className="swatch swatch--lg"
                      style={{ background: color }}
                      title={color}
                    />
                  ))}
                </div>

                <div className="demo-row">
                  <Button>Engage</Button>
                  <Button variant="ghost">Scan</Button>
                  <Badge tone="ok">Online</Badge>
                </div>

                <div className="demo-grid">
                  <Input label="Handle" defaultValue="V" />
                  <Select label="Role" defaultValue="Solo">
                    {ROLES.map((role) => (
                      <option key={role}>{role}</option>
                    ))}
                  </Select>
                </div>

                <Slider label="Street cred" defaultValue={72} />
                <Progress label="Cyberware load" value={46} tone="warn" />

                <ul className="trait-list">
                  {item.traits.map((trait) => (
                    <li key={trait}>{trait}</li>
                  ))}
                </ul>

                <Button
                  block
                  variant={active ? "ghost" : "primary"}
                  onClick={() => setTheme(item.id)}
                >
                  {active ? "Currently applied" : `Apply ${item.name}`}
                </Button>
              </div>
            </section>
          );
        })}
      </div>

      <Panel kicker="// Under the hood" title="One attribute, four skins">
        <div className="docs-grid">
          <div className="demo-stack">
            <p className="muted">
              Themes are pure CSS custom properties. Put <code>data-theme</code>{" "}
              on any subtree and every component inside it adopts that skin —
              useful for previews, embeds or side-by-side comparisons.
            </p>
            <pre className="code-block">
              <code>{`<ThemeProvider>
  <Button>Engage</Button>
</ThemeProvider>

// Any subtree can force a skin:
<section data-theme="kitsch">
  <Panel title="Preview" />
</section>`}</code>
            </pre>
          </div>
          <div className="demo-stack">
            <p className="muted">
              A component never knows which theme it is in. Styles come from
              tokens for color, type, radius, borders, shadow and texture, so
              adding a fifth skin means adding one token block — no component
              changes.
            </p>
            <ul className="trait-list trait-list--stack">
              <li>Theme choice persists in localStorage.</li>
              <li>Painted before first render to avoid a flash.</li>
              <li>Respects reduced-motion preferences.</li>
            </ul>
            <a className="cp-btn cp-btn--outline cp-btn--sm" href="#/components">
              Inspect components
            </a>
          </div>
        </div>
      </Panel>
    </div>
  );
}
