import { useState } from "react";
import { Alert, Badge, Progress } from "./Display";
import { Button } from "./Button";
import { CodeBlock } from "./CodeBlock";
import { Input, Select, Slider, Toggle } from "./Fields";
import { Panel } from "./Panel";
import { Tabs } from "./Tabs";

type TargetId = "button" | "panel" | "badge" | "progress" | "alert";

const TARGETS = [
  { id: "button", label: "Button" },
  { id: "panel", label: "Panel" },
  { id: "badge", label: "Badge" },
  { id: "progress", label: "Progress" },
  { id: "alert", label: "Alert" },
];

export function ComponentWorkbench() {
  const [target, setTarget] = useState<TargetId>("button");

  // Button state
  const [btnVariant, setBtnVariant] = useState<"primary" | "ghost" | "outline" | "danger">("primary");
  const [btnSize, setBtnSize] = useState<"sm" | "md" | "lg">("md");
  const [btnCode, setBtnCode] = useState("01");
  const [btnDisabled, setBtnDisabled] = useState(false);
  const [btnLabel, setBtnLabel] = useState("Breach protocol");

  // Panel state
  const [panelTitle, setPanelTitle] = useState("Cyberware deck");
  const [panelKicker, setPanelKicker] = useState("// SYS.04");
  const [panelTelemetry, setPanelTelemetry] = useState("LINK: OK");
  const [panelAccent, setPanelAccent] = useState(true);

  // Badge state
  const [badgeTone, setBadgeTone] = useState<"neutral" | "accent" | "ok" | "warn" | "danger">("accent");
  const [badgeSolid, setBadgeSolid] = useState(false);
  const [badgePulse, setBadgePulse] = useState(true);
  const [badgeText, setBadgeText] = useState("Uplink live");

  // Progress state
  const [progValue, setProgValue] = useState(72);
  const [progTone, setProgTone] = useState<"accent" | "ok" | "warn" | "danger">("accent");
  const [progSegmented, setProgSegmented] = useState(true);
  const [progLabel, setProgLabel] = useState("RAM allocation");

  // Alert state
  const [alertTone, setAlertTone] = useState<"info" | "ok" | "warn" | "danger">("warn");
  const [alertTitle, setAlertTitle] = useState("ICE detected");
  const [alertBody, setAlertBody] = useState("Subroutine trace at 23%. Reroute through proxy.");

  function buildSnippet(): string {
    switch (target) {
      case "button": {
        const props = [
          btnVariant !== "primary" && `variant="${btnVariant}"`,
          btnSize !== "md" && `size="${btnSize}"`,
          btnCode.trim() && `code="${btnCode.trim()}"`,
          btnDisabled && "disabled",
        ]
          .filter(Boolean)
          .join(" ");
        return `<Button${props ? ` ${props}` : ""}>\n  ${btnLabel || "Engage"}\n</Button>`;
      }
      case "panel": {
        const props = [
          panelKicker.trim() && `kicker="${panelKicker.trim()}"`,
          panelTitle.trim() && `title="${panelTitle.trim()}"`,
          panelTelemetry.trim() && `telemetry="${panelTelemetry.trim()}"`,
          panelAccent && "accent",
        ]
          .filter(Boolean)
          .join("\n  ");
        return `<Panel\n  ${props}\n>\n  <p>Subdermal telemetry nominal.</p>\n</Panel>`;
      }
      case "badge": {
        const props = [
          badgeTone !== "neutral" && `tone="${badgeTone}"`,
          badgeSolid && "solid",
          badgePulse && "pulse",
        ]
          .filter(Boolean)
          .join(" ");
        return `<Badge${props ? ` ${props}` : ""}>${badgeText || "Online"}</Badge>`;
      }
      case "progress": {
        const props = [
          `label="${progLabel || "Progress"}"`,
          `value={${progValue}}`,
          progTone !== "accent" && `tone="${progTone}"`,
          progSegmented && "segmented",
        ]
          .filter(Boolean)
          .join("\n  ");
        return `<Progress\n  ${props}\n/>`;
      }
      case "alert": {
        return `<Alert tone="${alertTone}" title="${alertTitle}">\n  ${alertBody}\n</Alert>`;
      }
    }
  }

  return (
    <Panel
      className="workbench"
      kicker="// Interactive inspector"
      title="Test & copy"
      telemetry="LIVE // SANDBOX"
      accent
      actions={
        <Tabs
          label="Component to inspect"
          items={TARGETS}
          value={target}
          onChange={(id) => setTarget(id as TargetId)}
        />
      }
    >
      <div className="workbench__grid">
        <div className="workbench__stage">
          <div className="workbench__reticle" aria-hidden="true">
            <span>PREVIEW // {target.toUpperCase()}</span>
            <span>[ + ]</span>
          </div>
          <div className="workbench__preview">
            {target === "button" && (
              <Button
                variant={btnVariant}
                size={btnSize}
                code={btnCode.trim() || undefined}
                disabled={btnDisabled}
              >
                {btnLabel || "Engage"}
              </Button>
            )}

            {target === "panel" && (
              <Panel
                kicker={panelKicker.trim() || undefined}
                title={panelTitle.trim() || undefined}
                telemetry={panelTelemetry.trim() || undefined}
                accent={panelAccent}
                style={{ width: "100%" }}
              >
                <p className="muted">
                  Subdermal telemetry nominal. Switch skins in the header to test all four design languages.
                </p>
              </Panel>
            )}

            {target === "badge" && (
              <Badge tone={badgeTone} solid={badgeSolid} pulse={badgePulse}>
                {badgeText || "Online"}
              </Badge>
            )}

            {target === "progress" && (
              <div style={{ width: "100%" }}>
                <Progress
                  label={progLabel}
                  value={progValue}
                  tone={progTone}
                  segmented={progSegmented}
                />
              </div>
            )}

            {target === "alert" && (
              <div style={{ width: "100%" }}>
                <Alert tone={alertTone} title={alertTitle}>
                  {alertBody}
                </Alert>
              </div>
            )}
          </div>

          <CodeBlock code={buildSnippet()} label={`JSX // ${target.toUpperCase()}`} />
        </div>

        <div className="workbench__controls">
          {target === "button" && (
            <div className="demo-stack">
              <Input
                label="Label"
                value={btnLabel}
                onChange={(e) => setBtnLabel(e.target.value)}
              />
              <div className="demo-grid">
                <Select
                  label="Variant"
                  value={btnVariant}
                  onChange={(e) => setBtnVariant(e.target.value as typeof btnVariant)}
                >
                  <option value="primary">primary</option>
                  <option value="ghost">ghost</option>
                  <option value="outline">outline</option>
                  <option value="danger">danger</option>
                </Select>
                <Select
                  label="Size"
                  value={btnSize}
                  onChange={(e) => setBtnSize(e.target.value as typeof btnSize)}
                >
                  <option value="sm">sm</option>
                  <option value="md">md</option>
                  <option value="lg">lg</option>
                </Select>
              </div>
              <Input
                label="Telemetry code"
                placeholder="01"
                value={btnCode}
                onChange={(e) => setBtnCode(e.target.value)}
              />
              <Toggle
                label="Disabled"
                checked={btnDisabled}
                onChange={(e) => setBtnDisabled(e.target.checked)}
              />
            </div>
          )}

          {target === "panel" && (
            <div className="demo-stack">
              <Input
                label="Title"
                value={panelTitle}
                onChange={(e) => setPanelTitle(e.target.value)}
              />
              <div className="demo-grid">
                <Input
                  label="Kicker"
                  value={panelKicker}
                  onChange={(e) => setPanelKicker(e.target.value)}
                />
                <Input
                  label="Telemetry"
                  value={panelTelemetry}
                  onChange={(e) => setPanelTelemetry(e.target.value)}
                />
              </div>
              <Toggle
                label="Accent border"
                checked={panelAccent}
                onChange={(e) => setPanelAccent(e.target.checked)}
              />
            </div>
          )}

          {target === "badge" && (
            <div className="demo-stack">
              <Input
                label="Text"
                value={badgeText}
                onChange={(e) => setBadgeText(e.target.value)}
              />
              <Select
                label="Tone"
                value={badgeTone}
                onChange={(e) => setBadgeTone(e.target.value as typeof badgeTone)}
              >
                <option value="neutral">neutral</option>
                <option value="accent">accent</option>
                <option value="ok">ok</option>
                <option value="warn">warn</option>
                <option value="danger">danger</option>
              </Select>
              <Toggle
                label="Solid fill"
                checked={badgeSolid}
                onChange={(e) => setBadgeSolid(e.target.checked)}
              />
              <Toggle
                label="Pulsing status node"
                checked={badgePulse}
                onChange={(e) => setBadgePulse(e.target.checked)}
              />
            </div>
          )}

          {target === "progress" && (
            <div className="demo-stack">
              <Input
                label="Label"
                value={progLabel}
                onChange={(e) => setProgLabel(e.target.value)}
              />
              <Slider
                label="Value"
                min={0}
                max={100}
                value={progValue}
                onChange={(e) => setProgValue(Number(e.target.value))}
              />
              <Select
                label="Tone"
                value={progTone}
                onChange={(e) => setProgTone(e.target.value as typeof progTone)}
              >
                <option value="accent">accent</option>
                <option value="ok">ok</option>
                <option value="warn">warn</option>
                <option value="danger">danger</option>
              </Select>
              <Toggle
                label="Segmented HUD bar"
                checked={progSegmented}
                onChange={(e) => setProgSegmented(e.target.checked)}
              />
            </div>
          )}

          {target === "alert" && (
            <div className="demo-stack">
              <Select
                label="Tone"
                value={alertTone}
                onChange={(e) => setAlertTone(e.target.value as typeof alertTone)}
              >
                <option value="info">info</option>
                <option value="ok">ok</option>
                <option value="warn">warn</option>
                <option value="danger">danger</option>
              </Select>
              <Input
                label="Title"
                value={alertTitle}
                onChange={(e) => setAlertTitle(e.target.value)}
              />
              <Input
                label="Message"
                value={alertBody}
                onChange={(e) => setAlertBody(e.target.value)}
              />
            </div>
          )}
        </div>
      </div>
    </Panel>
  );
}
