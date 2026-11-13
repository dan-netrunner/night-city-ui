import { useEffect, useState, type CSSProperties } from "react";
import { ThemeProvider, THEMES, useTheme } from "./theme";
import { Home } from "./pages/Home";
import { ComponentsPage } from "./pages/ComponentsPage";
import { Playground } from "./pages/Playground";
import { ThemesPage } from "./pages/ThemesPage";
import { GuidePage } from "./pages/GuidePage";

const ROUTES = [
  { id: "home", label: "Overview" },
  { id: "components", label: "Components" },
  { id: "playground", label: "Playground" },
  { id: "themes", label: "Themes" },
  { id: "guide", label: "Guide" },
] as const;

type RouteId = (typeof ROUTES)[number]["id"];

function readRoute(): RouteId {
  const hash = window.location.hash.replace(/^#\/?/, "");
  return ROUTES.some((route) => route.id === hash) ? (hash as RouteId) : "home";
}

function useHashRoute(): RouteId {
  const [route, setRoute] = useState<RouteId>(readRoute);

  useEffect(() => {
    const onHashChange = () => {
      setRoute(readRoute());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    document.title = `${ROUTES.find((r) => r.id === route)?.label ?? "Night City UI"} — Night City UI`;
  }, [route]);

  return route;
}

function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="theme-switch" role="group" aria-label="Interface theme">
      {THEMES.map((item) => (
        <button
          key={item.id}
          type="button"
          aria-pressed={theme === item.id}
          aria-label={`${item.name} theme`}
          title={item.name}
          style={{ "--dot": item.swatches[0] } as CSSProperties}
          onClick={() => setTheme(item.id)}
        >
          <span className="theme-switch__dot" aria-hidden="true" />
          <span className="theme-switch__name">{item.name}</span>
        </button>
      ))}
    </div>
  );
}

function Shell() {
  const route = useHashRoute();
  const { meta } = useTheme();

  return (
    <div className="app-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="app-noise" aria-hidden="true" />

      <header className="topbar">
        <div className="container topbar__inner">
          <a className="brand" href="#/home">
            <span className="brand__mark" aria-hidden="true">
              NC
            </span>
            <span className="brand__text">
              Night City <b>UI</b>
            </span>
          </a>

          <nav className="mainnav" aria-label="Main">
            {ROUTES.map((item) => (
              <a
                key={item.id}
                href={`#/${item.id}`}
                aria-current={route === item.id ? "page" : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <ThemeSwitch />
        </div>
      </header>

      <main id="main" className="container">
        {route === "home" && <Home />}
        {route === "components" && <ComponentsPage />}
        {route === "playground" && <Playground />}
        {route === "themes" && <ThemesPage />}
        {route === "guide" && <GuidePage />}
      </main>

      <footer className="footer">
        <div className="container footer__inner">
          <span>
            NIGHT CITY UI // LOCAL FAN PROJECT. NOT AFFILIATED WITH CD PROJEKT RED.
          </span>
          <span>
            ACTIVE SKIN: <b>{meta.name.toUpperCase()}</b>
          </span>
        </div>
      </footer>
    </div>
  );
}

export function App() {
  return (
    <ThemeProvider>
      <Shell />
    </ThemeProvider>
  );
}
