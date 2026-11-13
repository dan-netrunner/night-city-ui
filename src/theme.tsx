import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type ThemeId = "entropism" | "kitsch" | "neomilitarism" | "neokitsch";

export type ThemeMeta = {
  id: ThemeId;
  name: string;
  era: string;
  tagline: string;
  description: string;
  swatches: string[];
  traits: string[];
};

export const THEMES: ThemeMeta[] = [
  {
    id: "entropism",
    name: "Entropism",
    era: "2000s — 2050s",
    tagline: "Scavenged, repaired, kept alive.",
    description:
      "The aesthetic of scarcity. Rust, duct tape, recycled chrome and zero pretension — hardware that was old before you were born and still runs.",
    swatches: ["#e73132", "#c5ab41", "#efe2cd", "#211519"],
    traits: ["Rust and tape", "Dashed, worn borders", "Rough sans type", "Chamfered corners"],
  },
  {
    id: "kitsch",
    name: "Kitsch",
    era: "2060s — 2070s",
    tagline: "Loud, sweet and impossible to ignore.",
    description:
      "Mass-market nostalgia at full volume. Neon pinks, cartoon shapes, candy gradients and pop-art shadows, plugged straight into your optic nerve.",
    swatches: ["#ff4f8b", "#aacdf6", "#eeb92a", "#2a1620"],
    traits: ["Candy neon", "Clipped chunky panels", "Hard offset shadows", "Playful display type"],
  },
  {
    id: "neomilitarism",
    name: "Neo-Militarism",
    era: "2070s",
    tagline: "Corporate security chic.",
    description:
      "Built to survive a firefight. Gunmetal plating, hazard stripes, stencilled type and functional angles — every pixel looks like it passed inspection.",
    swatches: ["#eeb92a", "#7cc6ba", "#e9e4d2", "#141824"],
    traits: ["Hazard stripes", "Clipped tactical corners", "Stencil type", "Monospaced data"],
  },
  {
    id: "neokitsch",
    name: "Neokitsch",
    era: "2077",
    tagline: "Wealth, worn as a statement.",
    description:
      "Chrome, holograms and couture cyberware. Neokitsch is the language of the people who own Night City — polished, luminous and quietly expensive.",
    swatches: ["#7cc6ba", "#ff4f8b", "#eeb92a", "#121a2c"],
    traits: ["Glass and chrome", "Faceted corners", "Holographic gradients", "Sleek geometric type"],
  },
];

type ThemeContextValue = {
  theme: ThemeId;
  setTheme: (id: ThemeId) => void;
  meta: ThemeMeta;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = "nc-theme";
const THEME_COLORS: Record<ThemeId, string> = {
  entropism: "#160d10",
  kitsch: "#190f14",
  neomilitarism: "#0c0c0b",
  neokitsch: "#0b0c0f",
};

function initialTheme(): ThemeId {
  if (typeof document === "undefined") return "neokitsch";
  const current = document.documentElement.dataset.theme as ThemeId | undefined;
  return THEMES.some((t) => t.id === current) ? (current as ThemeId) : "neokitsch";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeId>(initialTheme);

  const setTheme = useCallback((id: ThemeId) => {
    setThemeState(id);
    document.documentElement.dataset.theme = id;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", THEME_COLORS[id]);
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      /* private mode: theme just won't persist */
    }
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const meta = THEMES.find((t) => t.id === theme) ?? THEMES[3];
  return (
    <ThemeContext.Provider value={{ theme, setTheme, meta }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
