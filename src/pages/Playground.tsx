import { useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Checkbox,
  Input,
  Modal,
  Panel,
  Progress,
  Select,
  Slider,
  Tabs,
  Toggle,
} from "../components";
import { CYBERWARE, DISTRICTS, TIER_TONE, WEAPONS, type Weapon } from "../data";
import { useTheme } from "../theme";
import { PageHead } from "./PageHead";

const eddies = (value: number) => `€$${value.toLocaleString("en-US")}`;

type Dialog = "connect" | "save" | null;

export function Playground() {
  const { meta } = useTheme();
  const [tab, setTab] = useState("loadout");
  const [query, setQuery] = useState("");
  const [equipped, setEquipped] = useState<Weapon | null>(null);
  const [body, setBody] = useState(8);
  const [reflexes, setReflexes] = useState(6);
  const [tech, setTech] = useState(11);
  const [synapse, setSynapse] = useState(36);
  const [overclock, setOverclock] = useState(false);
  const [installed, setInstalled] = useState<string[]>(["c1"]);
  const [handle, setHandle] = useState("V");
  const [savedHandle, setSavedHandle] = useState("V");
  const [district, setDistrict] = useState("Watson");
  const [dialog, setDialog] = useState<Dialog>(null);
  const [saved, setSaved] = useState(false);
  const [connected, setConnected] = useState(false);
  const [sos, setSos] = useState(false);

  const buildScore = Math.round(((body + reflexes + tech) / 60) * 100);
  const filtered = WEAPONS.filter((weapon) =>
    `${weapon.name} ${weapon.type}`.toLowerCase().includes(query.trim().toLowerCase()),
  );

  function toggleCyberware(id: string) {
    setInstalled((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function saveProfile() {
    setSavedHandle(handle.trim() || "V");
    setSaved(true);
    setDialog(null);
  }

  return (
    <div className="page">
      <PageHead
        eyebrow="Sandbox build 2.0.7.7"
        title="Operator playground"
        lead="A working dashboard built only from the kit. Equip hardware, install cyberware, push your stats and save a profile — all of it re-skins with the active theme."
      >
        <Badge tone="accent" solid>
          {meta.name}
        </Badge>
        <Badge tone={connected ? "ok" : "neutral"}>
          {connected ? "Uplink live" : "Offline"}
        </Badge>
      </PageHead>

      <div className="playground">
        <aside className="playground__side">
          <Panel
            kicker="// Mercenary file"
            title="Operator"
            actions={<Badge tone="ok">Active</Badge>}
          >
            <div className="profile">
              <div className="profile__portrait" aria-hidden="true">
                <span>{(savedHandle.trim()[0] ?? "V").toUpperCase()}</span>
              </div>
              <div className="profile__id">
                <h2>{savedHandle || "V"}</h2>
                <p className="mono-faint">
                  {district.toUpperCase()} // MERCENARY
                </p>
                <div className="chip-row">
                  <Badge tone="accent" solid>
                    Street cred 50
                  </Badge>
                  <Badge tone={connected ? "ok" : "danger"}>
                    {connected ? "Linked" : "No signal"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="demo-stack">
              <Slider
                label="Body"
                min={1}
                max={20}
                suffix=""
                value={body}
                onChange={(event) => setBody(Number(event.target.value))}
              />
              <Slider
                label="Reflexes"
                min={1}
                max={20}
                suffix=""
                value={reflexes}
                onChange={(event) => setReflexes(Number(event.target.value))}
              />
              <Slider
                label="Technical"
                min={1}
                max={20}
                suffix=""
                value={tech}
                onChange={(event) => setTech(Number(event.target.value))}
              />
              <Progress
                label="Build integrity"
                value={buildScore}
                tone={buildScore > 66 ? "ok" : buildScore > 33 ? "warn" : "danger"}
              />
            </div>

            {saved && (
              <Alert tone="ok" title="Profile saved">
                Written to this terminal: {savedHandle} / {district}.
              </Alert>
            )}

            <Button block variant="ghost" onClick={() => setDialog("save")}>
              Save profile
            </Button>
          </Panel>

          <Panel kicker="// Quick actions" title="Uplink">
            <div className="demo-stack">
              <Button block onClick={() => setDialog("connect")}>
                Connect to the NET
              </Button>
              <Button
                block
                variant="danger"
                onClick={() => {
                  setSos(true);
                  setConnected(false);
                }}
              >
                Distress beacon
              </Button>
              {sos && (
                <Alert
                  tone="danger"
                  title="Beacon broadcast"
                  onDismiss={() => setSos(false)}
                >
                  NCPD and two fixers have your coordinates. Move.
                </Alert>
              )}
            </div>
          </Panel>
        </aside>

        <div className="playground__main">
          <Tabs
            label="Playground sections"
            value={tab}
            onChange={setTab}
            items={[
              { id: "loadout", label: "Loadout", count: filtered.length },
              { id: "cyberware", label: "Cyberware", count: installed.length },
              { id: "settings", label: "Settings" },
            ]}
          />

          {tab === "loadout" && (
            <Panel
              kicker="// Loadout manager"
              title="Arsenal"
              actions={<Badge tone="accent">{filtered.length} items</Badge>}
              flush
            >
              <div className="panel-toolbar">
                <Input
                  aria-label="Search arsenal"
                  placeholder="Search by weapon or class…"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setQuery("");
                    setEquipped(null);
                  }}
                >
                  Reset
                </Button>
              </div>

              {equipped && (
                <div className="panel-flash">
                  <Alert
                    tone="ok"
                    title="Weapon equipped"
                    onDismiss={() => setEquipped(null)}
                  >
                    {equipped.name} — {equipped.type}, power {equipped.power}.
                  </Alert>
                </div>
              )}

              {filtered.length > 0 ? (
                <div className="cp-table-wrap">
                  <table className="cp-table" aria-label="Available weapons">
                    <thead>
                      <tr>
                        <th scope="col">Weapon</th>
                        <th scope="col">Class</th>
                        <th scope="col">Power</th>
                        <th scope="col">Tier</th>
                        <th scope="col">Price</th>
                        <th scope="col">
                          <span className="visually-hidden">Action</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((weapon) => {
                        const isEquipped = equipped?.id === weapon.id;
                        return (
                          <tr key={weapon.id}>
                            <td className="is-strong">{weapon.name}</td>
                            <td>{weapon.type}</td>
                            <td className="is-accent">{weapon.power}</td>
                            <td>
                              <Badge tone={TIER_TONE[weapon.tier]}>{weapon.tier}</Badge>
                            </td>
                            <td>{eddies(weapon.price)}</td>
                            <td className="is-end">
                              <Button
                                size="sm"
                                variant={isEquipped ? "ghost" : "outline"}
                                onClick={() => setEquipped(weapon)}
                              >
                                {isEquipped ? "Equipped" : "Equip"}
                              </Button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="panel-flash">
                  <Alert tone="info" title="No matches">
                    Try “pistol”, “rifle” or “tech” instead.
                  </Alert>
                </div>
              )}
            </Panel>
          )}

          {tab === "cyberware" && (
            <div className="panel-stack">
              <Panel
                kicker="// Ripperdoc services"
                title="Installed cyberware"
                actions={<Badge tone="accent">{installed.length} / {CYBERWARE.length}</Badge>}
              >
                <div className="check-list">
                  {CYBERWARE.map((item) => (
                    <Checkbox
                      key={item.id}
                      label={item.name}
                      hint={item.effect}
                      checked={installed.includes(item.id)}
                      onChange={() => toggleCyberware(item.id)}
                    />
                  ))}
                </div>
                <Progress
                  label="Chassis capacity"
                  value={(installed.length / CYBERWARE.length) * 100}
                  tone={installed.length > 3 ? "warn" : "accent"}
                />
              </Panel>

              <Panel kicker="// Neural tuning" title="Synapse governor">
                <div className="demo-stack">
                  <Toggle
                    label="Overclock"
                    hint="Bypasses thermal limits. Not covered by warranty."
                    checked={overclock}
                    onChange={(event) => setOverclock(event.target.checked)}
                  />
                  <Slider
                    label="Synapse load"
                    value={synapse}
                    onChange={(event) => setSynapse(Number(event.target.value))}
                  />
                  <Progress
                    label="Neural temperature"
                    value={synapse}
                    tone={synapse > 80 ? "danger" : synapse > 60 ? "warn" : "ok"}
                  />
                  {overclock && synapse > 75 && (
                    <Alert tone="danger" title="Thermal runaway">
                      Reduce synapse load or disengage overclock immediately.
                    </Alert>
                  )}
                  {!overclock && synapse > 60 && (
                    <Alert tone="warn" title="Load climbing">
                      Smooth sailing for now. Keep an eye on the gauge.
                    </Alert>
                  )}
                </div>
              </Panel>
            </div>
          )}

          {tab === "settings" && (
            <Panel kicker="// Operator settings" title="Profile">
              <div className="demo-stack">
                <Input
                  label="Handle"
                  value={handle}
                  maxLength={18}
                  onChange={(event) => setHandle(event.target.value)}
                  hint="Two characters minimum. Shown to everyone on the NET."
                />
                <Select
                  label="Home district"
                  value={district}
                  onChange={(event) => setDistrict(event.target.value)}
                >
                  {DISTRICTS.map((name) => (
                    <option key={name}>{name}</option>
                  ))}
                </Select>
                <Checkbox
                  label="Enable biometric lock"
                  hint="Requires a registered implant."
                  defaultChecked
                />
                <Toggle label="Share telemetry with fixers" defaultChecked />
                <div className="demo-row">
                  <Button onClick={() => setDialog("save")}>Save profile</Button>
                  <Button variant="ghost" onClick={() => setSaved(false)}>
                    Discard notice
                  </Button>
                </div>
                {saved && (
                  <Alert tone="ok" title="Saved">
                    {savedHandle} is now registered in {district}.
                  </Alert>
                )}
              </div>
            </Panel>
          )}
        </div>
      </div>

      <Modal
        open={dialog !== null}
        onClose={() => setDialog(null)}
        kicker={dialog === "connect" ? "// NET access" : "// Local shard"}
        title={dialog === "connect" ? "Connect to the NET" : "Save operator profile"}
        footer={
          <>
            <Button variant="ghost" onClick={() => setDialog(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                if (dialog === "connect") {
                  setConnected(true);
                  setDialog(null);
                } else {
                  saveProfile();
                }
              }}
            >
              {dialog === "connect" ? "Establish link" : "Save profile"}
            </Button>
          </>
        }
      >
        {dialog === "connect" ? (
          <div className="demo-stack">
            <p className="muted">
              The link is routed through three relays and billed to a dead
              fixer's account. Standard procedure.
            </p>
            <Input label="Access key" defaultValue="NC-2077-V" />
            <Alert tone="warn" title="Trace risk">
              NetWatch averages 42 seconds to flag an unshielded uplink.
            </Alert>
          </div>
        ) : (
          <div className="demo-stack">
            <p className="muted">Review before writing to the local shard.</p>
            <dl className="summary">
              <div>
                <dt>Handle</dt>
                <dd>{handle.trim() || "V"}</dd>
              </div>
              <div>
                <dt>District</dt>
                <dd>{district}</dd>
              </div>
              <div>
                <dt>Build</dt>
                <dd>
                  B{body} / R{reflexes} / T{tech}
                </dd>
              </div>
            </dl>
            <Checkbox
              label="I understand this profile stays on this terminal"
              defaultChecked
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
