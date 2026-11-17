import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { THEMES, ThemeProvider, useTheme, type ThemeId } from "./theme";

afterEach(cleanup);
beforeEach(() => {
  document.documentElement.removeAttribute("data-theme");
  document.head.querySelector('meta[name="theme-color"]')?.remove();
  localStorage.clear();
});

function Probe() {
  const { theme, setTheme, meta } = useTheme();
  return (
    <div>
      <span data-testid="skin">{meta.name}</span>
      <span data-testid="id">{theme}</span>
      <button type="button" onClick={() => setTheme("kitsch")}>
        Tacky
      </button>
      <button type="button" onClick={() => setTheme("neomilitarism")}>
        Corpo
      </button>
    </div>
  );
}

describe("themes", () => {
  it("ships the four skins with stable ids", () => {
    expect(THEMES.map((theme) => theme.id).sort()).toEqual(
      ["entropism", "kitsch", "neomilitarism", "neokitsch"].sort(),
    );
    expect(THEMES.map((theme) => theme.name)).toContain("Hyper//Opulence");
  });

  it("starts on Hyper//Opulence and writes data-theme", () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    expect(document.documentElement.dataset.theme).toBe("neokitsch");
    expect(screen.getByTestId("skin").textContent).toBe("Hyper//Opulence");
  });

  it("adopts a theme already set before hydration", () => {
    document.documentElement.dataset.theme = "entropism";
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    expect(screen.getByTestId("skin").textContent).toBe("Scrap//Tech");
  });

  it("switches skin, meta colour and persistence together", () => {
    const meta = document.createElement("meta");
    meta.name = "theme-color";
    meta.content = "#0b0c0f";
    document.head.append(meta);

    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Tacky" }));

    expect(document.documentElement.dataset.theme).toBe("kitsch");
    expect(screen.getByTestId("skin").textContent).toBe("Tacky//Futurism");
    expect(screen.getByTestId("id").textContent).toBe("kitsch");
    expect(localStorage.getItem("nc-theme")).toBe("kitsch");
    expect(meta.content).toBe("#190f14");

    fireEvent.click(screen.getByRole("button", { name: "Corpo" }));
    expect(document.documentElement.dataset.theme).toBe("neomilitarism");
    expect(localStorage.getItem("nc-theme")).toBe("neomilitarism");
  });

  it("survives a storage backend that throws", () => {
    const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Tacky" }));
    expect(document.documentElement.dataset.theme).toBe("kitsch");
    setItem.mockRestore();
  });

  it("refuses to report a theme outside the provider", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    const Broken = () => {
      useTheme();
      return null;
    };
    expect(() => render(<Broken />)).toThrow(/ThemeProvider/);
    consoleError.mockRestore();
  });
});

it("ThemeId stays limited to the shipped skins", () => {
  const ids: ThemeId[] = ["entropism", "kitsch", "neomilitarism", "neokitsch"];
  expect(ids).toHaveLength(4);
});
