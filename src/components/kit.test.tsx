import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import {
  Accordion,
  Alert,
  Avatar,
  Badge,
  Breadcrumbs,
  Button,
  Checkbox,
  CodeBlock,
  Divider,
  EmptyState,
  Input,
  Kbd,
  Metric,
  Modal,
  Pagination,
  Panel,
  Progress,
  Radio,
  Select,
  Skeleton,
  Slider,
  Spinner,
  Tabs,
  Textarea,
  Toggle,
  Tooltip,
  ToastStack,
  type ToastItem,
} from "./index";

afterEach(cleanup);

// jsdom has no <dialog> implementation; the component only calls these two.
beforeEach(() => {
  const proto = window.HTMLDialogElement?.prototype;
  if (!proto) return;
  if (!proto.showModal) {
    proto.showModal = function showModal(this: HTMLDialogElement) {
      this.open = true;
    };
  }
  if (!proto.close) {
    proto.close = function close(this: HTMLDialogElement) {
      this.open = false;
    };
  }
});

describe("Button", () => {
  it("is a real submit-typed-outside button with variant classes", () => {
    render(
      <Button variant="outline" size="sm" code="01" block>
        Engage
      </Button>,
    );
    const button = screen.getByRole("button", { name: /Engage/ });
    expect(button.tagName).toBe("BUTTON");
    expect(button.getAttribute("type")).toBe("button");
    expect(button.className).toContain("cp-btn--outline");
    expect(button.className).toContain("cp-btn--sm");
    expect(button.className).toContain("cp-btn--block");
    // The HUD tag is decoration: it must not be read out twice.
    expect(button.querySelector(".cp-btn__code")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("fires onClick and honours disabled", () => {
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Deploy
      </Button>,
    );
    const button = screen.getByRole("button", { name: "Deploy" });
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
    expect(button).toHaveProperty("disabled", true);
  });
});

describe("Panel", () => {
  it("renders head, body and footer slots", () => {
    render(
      <Panel kicker="// SYS.01" title="Terminal" telemetry="LINK: OK" footer={<span>foot</span>} accent>
        <p>content</p>
      </Panel>,
    );
    expect(screen.getByRole("heading", { name: "Terminal" }).tagName).toBe("H3");
    expect(screen.getByText("// SYS.01")).toBeTruthy();
    expect(screen.getByText("content")).toBeTruthy();
    expect(screen.getByText("foot")).toBeTruthy();
    expect(document.querySelector(".cp-panel--accent")).toBeTruthy();
    // telemetry is a corner stamp, not content for assistive tech
    expect(document.querySelector(".cp-panel__telemetry")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("omits the head entirely when there is nothing to show", () => {
    render(<Panel>plain</Panel>);
    expect(document.querySelector(".cp-panel__head")).toBeNull();
  });
});

describe("Display components", () => {
  it("Badge exposes tone and hides the pulse node", () => {
    render(
      <Badge tone="ok" pulse>
        Online
      </Badge>,
    );
    const badge = screen.getByText("Online");
    expect(badge.className).toContain("cp-badge--ok");
    expect(badge.querySelector(".cp-badge__node")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("Progress clamps, labels the bar and fills segments", () => {
    const { rerender } = render(<Progress label="RAM deck" value={150} segmented />);
    const bar = screen.getByRole("progressbar");
    expect(bar.getAttribute("aria-valuenow")).toBe("100");
    expect(bar.getAttribute("aria-label")).toBe("RAM deck");
    expect(bar.querySelectorAll(".is-filled")).toHaveLength(12);

    rerender(<Progress label="RAM deck" value={75} segmented />);
    expect(document.querySelectorAll(".cp-progress__seg.is-filled")).toHaveLength(9);
    expect(screen.getByText("75%")).toBeTruthy();
  });

  it("Alert is a status, or an alert when dangerous, and can dismiss", () => {
    const onDismiss = vi.fn();
    render(
      <Alert tone="danger" title="Breach" onDismiss={onDismiss}>
        ICE detected
      </Alert>,
    );
    expect(screen.getByRole("alert")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Dismiss message" }));
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("Divider is a separator, Metric shows unit, EmptyState keeps its action", () => {
    render(
      <>
        <Divider label="OR" />
        <Metric label="Street cred" value={72} unit="%" tone="ok" delta="+4" />
        <EmptyState title="No jobs" action={<Button>Hire</Button>} />
      </>,
    );
    expect(screen.getByRole("separator")).toBeTruthy();
    expect(screen.getByText("72").querySelector("small")?.textContent).toBe("%");
    expect(screen.getByText("+4")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Hire" })).toBeTruthy();
  });

  it("Avatar derives initials and names itself; Kbd, Spinner, Skeleton stay honest", () => {
    render(
      <>
        <Avatar name="Jordan Smith" status="online" />
        <Kbd>Ctrl</Kbd>
        <Spinner label="Syncing" />
        <Skeleton width={120} height={12} />
      </>,
    );
    const avatar = screen.getByRole("img", { name: "Jordan Smith" });
    expect(avatar.textContent).toContain("JS");
    expect(avatar.querySelector(".cp-avatar__status")?.getAttribute("aria-hidden")).toBe("true");
    expect(screen.getByText("Ctrl").tagName).toBe("KBD");
    expect(screen.getByRole("status").textContent).toContain("Syncing");
    expect(document.querySelector(".cp-skeleton")?.getAttribute("aria-hidden")).toBe("true");
  });
});

describe("Fields", () => {
  it("Input links label, hint and error to the control", () => {
    render(<Input label="Handle" hint="3-16 chars" defaultValue="v" />);
    const input = screen.getByLabelText<HTMLInputElement>("Handle");
    expect(input.value).toBe("v");
    expect(input.getAttribute("aria-describedby")).toBe(`${input.id}-msg`);
    expect(screen.getByText("3-16 chars")).toBeTruthy();
  });

  it("Input error marks the control invalid", () => {
    render(<Input label="Handle" error="Taken" />);
    const input = screen.getByLabelText<HTMLInputElement>("Handle");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(input.className).toContain("cp-input--error");
  });

  it("Textarea and Select keep their labels", () => {
    render(
      <>
        <Textarea label="Brief" rows={6} />
        <Select label="Route">
          <option>Rooftop</option>
          <option>Freight</option>
        </Select>
      </>,
    );
    expect((screen.getByLabelText("Brief") as HTMLTextAreaElement).rows).toBe(6);
    expect(screen.getByLabelText("Route").tagName).toBe("SELECT");
  });

  it("Checkbox and Radio associate the whole label", () => {
    render(
      <>
        <Checkbox label="Opt in" defaultChecked />
        <Radio name="route" label="Rooftop" />
      </>,
    );
    expect(screen.getByLabelText<HTMLInputElement>("Opt in").checked).toBe(true);
    expect(screen.getByLabelText<HTMLInputElement>("Rooftop").getAttribute("name")).toBe("route");
  });

  it("Toggle is a switch", () => {
    render(<Toggle label="Stealth" />);
    const toggle = screen.getByRole("switch", { name: "Stealth" });
    fireEvent.click(toggle);
    expect((toggle as HTMLInputElement).checked).toBe(true);
  });

  it("Slider reports its value and updates uncontrolled", () => {
    render(<Slider label="Accent hue" defaultValue={30} />);
    expect(screen.getByText("30%")).toBeTruthy();
    fireEvent.change(screen.getByLabelText("Accent hue"), { target: { value: "55" } });
    expect(screen.getByText("55%")).toBeTruthy();
  });
});

describe("Tabs", () => {
  const items = [
    { id: "a", label: "Log", count: 3 },
    { id: "b", label: "Map" },
    { id: "c", label: "Gear" },
  ];

  it("follows the tab pattern with a roving tab index", () => {
    render(<Tabs items={items} value="b" onChange={() => {}} label="Views" />);
    const list = screen.getByRole("tablist", { name: "Views" });
    const tabs = screen.getAllByRole("tab");
    expect(list).toBeTruthy();
    expect(tabs.map((tab) => tab.getAttribute("aria-selected"))).toEqual(["false", "true", "false"]);
    expect(tabs.map((tab) => tab.getAttribute("tabindex"))).toEqual(["-1", "0", "-1"]);
    expect(tabs[0].querySelector(".cp-tab__count")?.textContent).toBe("3");
  });

  it("arrow keys move the selection and wrap around", () => {
    const onChange = vi.fn();
    render(<Tabs items={items} value="c" onChange={onChange} label="Views" />);
    fireEvent.keyDown(screen.getByRole("tablist"), { key: "ArrowRight" });
    expect(onChange).toHaveBeenCalledWith("a");
  });
});

describe("Accordion", () => {
  it("is native details/summary and opens the requested item", () => {
    render(
      <Accordion
        items={[
          { id: "one", title: "First", children: "1" },
          { id: "two", title: "Second", meta: "v2", children: "2" },
        ]}
        defaultOpen="two"
      />,
    );
    const open = document.querySelector('details[open]');
    expect(open?.textContent).toContain("Second");
    expect(screen.getByText("Second").closest("summary")?.querySelector(".cp-accordion__meta")?.textContent).toBe("v2");
  });
});

describe("Modal", () => {
  it("opens as a dialog, locks the body and closes on the button", () => {
    const onClose = vi.fn();
    render(
      <Modal open onClose={onClose} title="Confirm run">
        <p>body</p>
      </Modal>,
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog.getAttribute("aria-labelledby")).toBeTruthy();
    expect(dialog.hasAttribute("open")).toBe(true);
    expect(document.body.style.overflow).toBe("hidden");
    fireEvent.click(screen.getByRole("button", { name: "Close dialog" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes when the backdrop itself is clicked", () => {
    const onClose = vi.fn();
    const { container } = render(
      <Modal open onClose={onClose} title="Confirm run">
        <p>body</p>
      </Modal>,
    );
    fireEvent.click(container.querySelector("dialog")!);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe("Feedback", () => {
  it("Tooltip wires aria-describedby onto the trigger", () => {
    render(
      <Tooltip label="Street level">
        <Button>Route</Button>
      </Tooltip>,
    );
    const bubble = screen.getByRole("tooltip");
    expect(screen.getByRole("button", { name: "Route" }).getAttribute("aria-describedby")).toContain(
      bubble.id,
    );
  });

  it("ToastStack renders nothing when empty and dismisses by id", () => {
    const { rerender } = render(<ToastStack items={[]} onDismiss={() => {}} />);
    expect(document.querySelector(".cp-toasts")).toBeNull();

    const onDismiss = vi.fn();
    const items: ToastItem[] = [
      { id: "t1", title: "Upload done", tone: "ok" },
      { id: "t2", title: "Trace lost", tone: "danger" },
    ];
    rerender(<ToastStack items={items} onDismiss={onDismiss} />);
    expect(screen.getByRole("region", { name: "Notifications" })).toBeTruthy();
    expect(screen.getByRole("alert").textContent).toContain("Trace lost");
    fireEvent.click(screen.getAllByRole("button", { name: "Dismiss notification" })[0]);
    expect(onDismiss).toHaveBeenCalledWith("t1");
  });
});

describe("Nav", () => {
  it("Breadcrumbs mark the current page", () => {
    render(<Breadcrumbs items={[{ label: "Home", href: "#/" }, { label: "Jobs" }]} />);
    expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeTruthy();
    expect(screen.getByText("Home").tagName).toBe("A");
    expect(screen.getByText("Jobs").getAttribute("aria-current")).toBe("page");
  });

  it("Pagination disables the ends and reports the current page", () => {
    const onChange = vi.fn();
    render(<Pagination page={1} pageCount={3} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "2" }));
    expect(onChange).toHaveBeenCalledWith(2);
    expect((screen.getByRole("button", { name: "Prev" }) as HTMLButtonElement).disabled).toBe(true);
    expect(screen.getByRole("button", { name: "2" }).getAttribute("aria-current")).toBeNull();
  });
});

describe("CodeBlock", () => {
  it("copies the snippet and announces it", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
    render(<CodeBlock code={'npm i night-city-ui'} label="SHELL" />);
    expect(screen.getByText("SHELL")).toBeTruthy();
    expect(document.querySelector(".cp-code__pre code")?.textContent).toBe("npm i night-city-ui");
    fireEvent.click(screen.getByRole("button", { name: "Copy" }));
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(writeText).toHaveBeenCalledWith("npm i night-city-ui");
    expect(screen.getByRole("button", { name: "Copied // OK" })).toBeTruthy();
  });

  it("does not claim success when the clipboard is blocked", async () => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn().mockRejectedValue(new Error("blocked")) },
      configurable: true,
    });
    render(<CodeBlock code="x" />);
    fireEvent.click(screen.getByRole("button", { name: "Copy" }));
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(screen.getByRole("button", { name: "Copy" })).toBeTruthy();
  });
});
