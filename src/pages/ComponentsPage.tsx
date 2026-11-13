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
import { ROLES, TIER_TONE, WEAPONS } from "../data";
import { ComponentWorkbench } from "../components/ComponentWorkbench";
import { PageHead } from "./PageHead";

const eddies = (value: number) => `€$${value.toLocaleString("en-US")}`;

export function ComponentsPage() {
  const [tab, setTab] = useState("stats");
  const [modalOpen, setModalOpen] = useState(false);
  const [alertVisible, setAlertVisible] = useState(true);
  const [saved, setSaved] = useState(false);

  return (
    <div className="page">
      <PageHead
        eyebrow="Component catalog"
        title="Every part, four skins"
        lead="Interactive specimens, not screenshots. Test props live, copy JSX snippets, or change the theme in the header."
      >
        <Badge tone="accent" solid pulse>
          14 components
        </Badge>
      </PageHead>

      <ComponentWorkbench />

      <div className="comp-grid">
        <Panel className="span-4" kicker="// 01 actions" title="Buttons" telemetry="BTN.01">
          <div className="demo-stack">
            <div className="demo-row">
              <Button code="01">Primary</Button>
              <Button variant="ghost">Ghost</Button>
            </div>
            <div className="demo-row">
              <Button variant="outline" code="NET">Outline</Button>
              <Button variant="danger">Danger</Button>
            </div>
            <div className="demo-row">
              <Button size="sm">Small</Button>
              <Button size="lg">Large</Button>
              <Button disabled>Offline</Button>
            </div>
          </div>
        </Panel>

        <Panel className="span-4" kicker="// 02 form" title="Inputs">
          <div className="demo-stack">
            <Input
              label="Handle"
              placeholder="V@nightcity"
              hint="Visible to fixers and ripperdocs."
            />
            <Input
              label="Access code"
              defaultValue="0000"
              error="Code rejected. Two attempts left."
            />
            <Select label="Role" defaultValue="solo">
              {ROLES.map((role) => (
                <option key={role}>{role}</option>
              ))}
            </Select>
            <Slider label="Optical zoom" defaultValue={64} />
          </div>
        </Panel>

        <Panel className="span-4" kicker="// 03 form" title="Selection">
          <div className="demo-stack">
            <Checkbox
              label="Accept the contract"
              hint="The fixer takes 15% off the top."
              defaultChecked
            />
            <Checkbox label="Share location with the crew" />
            <Toggle
              label="Optical camo"
              hint="Drains battery while active."
              defaultChecked
            />
            <Toggle label="Silent mode" />
            <Slider
              label="Synapse load"
              defaultValue={38}
              suffix="%"
            />
          </div>
        </Panel>

        <Panel className="span-4" kicker="// 04 feedback" title="Badges">
          <div className="demo-stack">
            <div className="demo-row">
              <Badge>Neutral</Badge>
              <Badge tone="accent">Accent</Badge>
              <Badge tone="ok">Synced</Badge>
              <Badge tone="warn">Risk</Badge>
              <Badge tone="danger">Hostile</Badge>
            </div>
            <div className="demo-row">
              <Badge tone="accent" solid>
                Solid
              </Badge>
              <Badge tone="ok" solid>
                Online
              </Badge>
              <Badge tone="danger" solid>
                Flatlined
              </Badge>
            </div>
          </div>
        </Panel>

        <Panel className="span-4" kicker="// 05 data" title="Progress" telemetry="HUD.05">
          <div className="demo-stack">
            <Progress label="Street cred" value={72} />
            <Progress label="RAM deck (segmented)" value={84} tone="ok" segmented />
            <Progress label="Trace risk" value={23} tone="danger" segmented />
            <Progress label="Unknown signal" value={51} showValue={false} />
          </div>
        </Panel>

        <Panel className="span-4" kicker="// 06 feedback" title="Alerts">
          <div className="demo-stack">
            {alertVisible ? (
              <Alert
                title="Uplink established"
                tone="ok"
                onDismiss={() => setAlertVisible(false)}
              >
                Netrunner access granted for 00:12:44.
              </Alert>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAlertVisible(true)}
              >
                Restore alert
              </Button>
            )}
            <Alert tone="warn" title="Cyberware stress">
              Synapse load is above the recommended threshold.
            </Alert>
            <Alert tone="danger" title="Trace in progress">
              Disconnect or counter-hack before the timer expires.
            </Alert>
          </div>
        </Panel>

        <Panel className="span-7" kicker="// 07 navigation" title="Tabs">
          <Tabs
            label="Character sections"
            value={tab}
            onChange={setTab}
            items={[
              { id: "overview", label: "Overview" },
              { id: "stats", label: "Stats" },
              { id: "gear", label: "Gear", count: 4 },
            ]}
          />
          <div className="tab-demo" role="tabpanel">
            {tab === "overview" && (
              <p className="muted">
                A solo with a habit of taking jobs nobody else survives. Tabs
                cycle with the arrow keys and keep the theme's own active state.
              </p>
            )}
            {tab === "stats" && (
              <div className="demo-stack">
                <Progress label="Body" value={80} />
                <Progress label="Reflexes" value={60} />
                <Progress label="Technical ability" value={110} max={120} />
              </div>
            )}
            {tab === "gear" && (
              <ul className="data-list">
                <li>
                  <span>Malorian Arms 3516</span>
                  <Badge tone="danger">Legendary</Badge>
                </li>
                <li>
                  <span>Kiroshi Optics Mk.3</span>
                  <Badge tone="accent">Cyberware</Badge>
                </li>
                <li>
                  <span>Sandevistan</span>
                  <Badge tone="warn">Prototype</Badge>
                </li>
                <li>
                  <span>MaxDocs ×4</span>
                  <Badge>Consumable</Badge>
                </li>
              </ul>
            )}
          </div>
        </Panel>

        <Panel className="span-5" kicker="// 08 overlays" title="Modal">
          <p className="muted">
            A native <code>&lt;dialog&gt;</code>: focus trapped by the browser,
            Esc to cancel, ambient click to dismiss.
          </p>
          {saved && (
            <Alert tone="ok" title="Changes committed">
              Your preferences were written to the local shard.
            </Alert>
          )}
          <Button block onClick={() => setModalOpen(true)}>
            Open dialog
          </Button>
        </Panel>

        <Panel
          className="span-12"
          kicker="// 09 data grid"
          title="Table"
          actions={<Badge tone="accent">{WEAPONS.length} items</Badge>}
          flush
        >
          <div className="cp-table-wrap">
            <table className="cp-table" aria-label="Weapon catalog">
              <thead>
                <tr>
                  <th scope="col">Weapon</th>
                  <th scope="col">Class</th>
                  <th scope="col">Power</th>
                  <th scope="col">Tier</th>
                  <th scope="col">Price</th>
                </tr>
              </thead>
              <tbody>
                {WEAPONS.slice(0, 5).map((weapon) => (
                  <tr key={weapon.id}>
                    <td className="is-strong">{weapon.name}</td>
                    <td>{weapon.type}</td>
                    <td className="is-accent">{weapon.power}</td>
                    <td>
                      <Badge tone={TIER_TONE[weapon.tier]}>{weapon.tier}</Badge>
                    </td>
                    <td>{eddies(weapon.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        kicker="// Preferences"
        title="Configure your rig"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                setSaved(true);
                setModalOpen(false);
              }}
            >
              Commit changes
            </Button>
          </>
        }
      >
        <div className="demo-stack">
          <Input label="Handle" defaultValue="V" />
          <Select label="Home district" defaultValue="Watson">
            <option>Watson</option>
            <option>Westbrook</option>
            <option>Pacifica</option>
            <option>Santo Domingo</option>
          </Select>
          <Checkbox
            label="Enable biometric lock"
            hint="Requires a registered implant."
            defaultChecked
          />
        </div>
      </Modal>
    </div>
  );
}
