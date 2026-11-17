import { Badge, Button, CodeBlock, Panel, Progress } from "../components";
import { THEMES, useTheme } from "../theme";

function ThemeCard({ index }: { index: number }) {
  const item = THEMES[index];
  const { theme, setTheme } = useTheme();
  const active = theme === item.id;

  return (
    <article className="theme-card">
      <div className="theme-card__preview" data-theme={item.id} aria-hidden="true">
        <div className="mini-bar">
          <span>{String(index + 1).padStart(2, "0")} // {item.era}</span>
          <span className="mini-bar__dot" />
        </div>
        <div className="mini-title">{item.name}</div>
        <div className="mini-row">
          <span className="cp-btn cp-btn--primary cp-btn--sm">Engage</span>
          <span className="cp-badge cp-badge--ok">Online</span>
          <span className="cp-badge cp-badge--solid">v2.0</span>
        </div>
        <div className="mini-field">Enter handle</div>
        <div className="cp-progress">
          <div className="cp-progress__track">
            <span
              className="cp-progress__fill cp-progress__fill--warn"
              style={{ width: `${44 + index * 14}%` }}
            />
          </div>
        </div>
      </div>

      <div className="theme-card__body">
        <div className="theme-card__title-row">
          <h3>{item.name}</h3>
          <span className="theme-card__era">{item.era}</span>
        </div>
        <p>{item.tagline}</p>
        <div className="swatches" aria-label={`${item.name} palette`}>
          {item.swatches.map((color) => (
            <span
              key={color}
              className="swatch"
              style={{ background: color }}
              title={color}
            />
          ))}
        </div>
        <Button
          variant={active ? "ghost" : "outline"}
          size="sm"
          block
          onClick={() => setTheme(item.id)}
        >
          {active ? "Currently active" : "Apply theme"}
        </Button>
      </div>
    </article>
  );
}

function HeroPanel() {
  const { meta } = useTheme();
  return (
    <Panel
      className="hero-panel"
      kicker="// NCPD DATABASE"
      title="Subject profile"
      telemetry="SYS // 2077"
      accent
      actions={<Badge tone="ok" pulse>Active</Badge>}
      footer={
        <>
          <span className="mono-faint">SKIN: {meta.name.toUpperCase()}</span>
          <Button variant="ghost" size="sm">
            Open file
          </Button>
        </>
      }
    >
      <div className="dossier">
        <div className="dossier__portrait" aria-hidden="true">
          <span>V</span>
        </div>
        <div className="dossier__facts">
          <p className="dossier__name">
            V <span>// mercenary</span>
          </p>
          <div className="chip-row">
            <Badge tone="accent" solid>
              Street cred 50
            </Badge>
            <Badge>Watson</Badge>
            <Badge tone="warn">Wanted</Badge>
          </div>
          <Progress label="Street cred" value={72} />
          <Progress label="Cyberware load" value={46} tone="warn" segmented />
        </div>
      </div>
      <dl className="dossier__stats">
        <div>
          <dt>Body</dt>
          <dd>08</dd>
        </div>
        <div>
          <dt>Reflexes</dt>
          <dd>06</dd>
        </div>
        <div>
          <dt>Technical</dt>
          <dd>11</dd>
        </div>
        <div>
          <dt>Cool</dt>
          <dd>09</dd>
        </div>
      </dl>
    </Panel>
  );
}

const CATALOG = [
  "Button",
  "Panel",
  "Input",
  "Textarea",
  "Select",
  "Checkbox",
  "Radio",
  "Toggle",
  "Slider",
  "Tabs",
  "Badge",
  "Progress",
  "Alert",
  "Toast",
  "Tooltip",
  "Modal",
  "Accordion",
  "Breadcrumbs",
  "Pagination",
  "Divider",
  "Kbd",
  "Avatar",
  "Metric",
  "Skeleton",
  "Spinner",
  "EmptyState",
  "CodeBlock",
  "Table",
];

export function Home() {
  return (
    <div className="page">
      <section className="hero">
        <div className="hero__copy">
          <div className="cp-eyebrow">Night City // UI system 2.0.7.7</div>
          <h1>
            Four futures.
            <br />
            <em>One interface.</em>
          </h1>
          <p className="lead">
            A React component kit that wears the four design languages of Night
            City — scavenged Scrap//Tech, candy-bright Tacky//Futurism,
            corporate Corpo//Brutalism and chrome-plated Hyper//Opulence. Same
            components, four skins, switched live from the top bar.
          </p>
          <div className="hero__actions">
            <a className="cp-btn cp-btn--primary cp-btn--lg" href="#/components">
              Browse components
            </a>
            <a className="cp-btn cp-btn--ghost cp-btn--lg" href="#/playground">
              Open playground
            </a>
          </div>
          <div className="hero__install">
            <CodeBlock code="npm install night-city-ui" label="INSTALL // NPM" />
          </div>
          <dl className="hero__meta">
            <div>
              <dt>Themes</dt>
              <dd>04</dd>
            </div>
            <div>
              <dt>Components</dt>
              <dd>28</dd>
            </div>
            <div>
              <dt>Runtime deps</dt>
              <dd>React only</dd>
            </div>
          </dl>
        </div>
        <HeroPanel />
      </section>

      <section>
        <div className="section-head">
          <div>
            <div className="cp-eyebrow">Design languages</div>
            <h2>Pick a skin. Everything follows.</h2>
          </div>
          <p>
            The four styles are CSS token sets applied through a single
            <code> data-theme</code> attribute. Swap the skin and every button,
            field, meter and dialog changes with it.
          </p>
        </div>
        <div className="theme-grid">
          {THEMES.map((_, index) => (
            <ThemeCard key={THEMES[index].id} index={index} />
          ))}
        </div>
      </section>

      <section className="split">
        <Panel kicker="// The kit" title="Re-skinned, not rebuilt">
          <p className="muted">
            Every component is made of semantic markup, a handful of CSS custom
            properties and nothing else. Themes change color, type, radius,
            borders, shadows and texture — never structure.
          </p>
          <ul className="feature-list">
            <li>
              <span className="feature-list__index">01</span>
              <span>
                <b>One provider.</b> Persist the active theme and paint it before
                first render.
              </span>
            </li>
            <li>
              <span className="feature-list__index">02</span>
              <span>
                <b>Accessible by default.</b> Native controls, focus rings, ARIA
                tabs and a real dialog element.
              </span>
            </li>
            <li>
              <span className="feature-list__index">03</span>
              <span>
                <b>No UI dependency.</b> React plus local font files. Copy a
                component, keep the skin.
              </span>
            </li>
          </ul>
        </Panel>

        <Panel kicker="// Catalog" title="What's inside">
          <div className="chip-row chip-row--loose">
            {CATALOG.map((name) => (
              <a className="chip" href="#/components" key={name}>
                {name}
              </a>
            ))}
          </div>
          <p className="muted small">
            Every component below is live. Change the skin from the header and
            watch the entire catalog re-render in place.
          </p>
          <a className="cp-btn cp-btn--outline cp-btn--sm" href="#/themes">
            Compare themes
          </a>
        </Panel>
      </section>

      <section className="cta-band">
        <div>
          <div className="cp-eyebrow">// Ready when you are</div>
          <h2>Jack in and try the whole kit.</h2>
          <p>
            The playground combines the components into a working operator
            dashboard: sliders, tabs, filters, dialogs and a live status feed.
          </p>
        </div>
        <div className="cta-band__actions">
          <a className="cp-btn cp-btn--primary" href="#/playground">
            Enter playground
          </a>
          <a className="cp-btn cp-btn--ghost" href="#/components">
            See components
          </a>
        </div>
      </section>
    </div>
  );
}
