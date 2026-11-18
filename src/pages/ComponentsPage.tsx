import { useState } from "react";
import {
  Accordion,
  Alert,
  Avatar,
  Badge,
  Breadcrumbs,
  Button,
  Checkbox,
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
  ToastStack,
  Toggle,
  Tooltip,
  type ToastItem,
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
  const [page, setPage] = useState(2);
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  function pushToast() {
    setToasts((current) => [
      ...current.slice(-2),
      {
        id: String(Date.now()),
        title: "Uplink established",
        message: "Netrunner access granted for 00:12:44.",
        tone: "ok",
      },
    ]);
  }

  return (
    <div className="page">
      <PageHead
        eyebrow="Component catalog"
        title="Every part, four skins"
        lead="Interactive specimens, not screenshots. Test props live, copy JSX snippets, or change the theme in the header."
      >
        <Badge tone="accent" solid pulse>
          28 components
        </Badge>
      </PageHead>

      <p className="muted small">
        Full props tables for every component:{" "}
        <a
          href="https://github.com/dan-netrunner/night-city-ui/blob/main/docs/COMPONENTS.md"
          target="_blank"
          rel="noreferrer"
        >
          docs/COMPONENTS.md
        </a>
        .
      </p>

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
          className="span-6"
          kicker="// 10 form"
          title="Long text & radios"
          telemetry="FIELD.10"
        >
          <div className="demo-stack">
            <Textarea
              label="Job brief"
              placeholder="Meet the fixer at the Afterlife, booth 04..."
              hint="Encrypted on submit. 400 characters max."
            />
            <div className="demo-stack">
              <span className="cp-field__label">Extraction route</span>
              <Radio
                name="route"
                label="Rooftop — stealth"
                hint="Low profile, slow descent."
                defaultChecked
              />
              <Radio name="route" label="Freight elevator" />
              <Radio name="route" label="Front door" hint="Not recommended." />
            </div>
          </div>
        </Panel>

        <Panel
          className="span-6"
          kicker="// 11 navigation"
          title="Breadcrumbs & pagination"
          telemetry="NAV.11"
        >
          <div className="demo-stack">
            <Breadcrumbs
              items={[
                { label: "Home", href: "#/home" },
                { label: "Components", href: "#/components" },
                { label: "Navigation" },
              ]}
            />
            <Divider />
            <Pagination page={page} pageCount={6} onChange={setPage} />
            <p className="muted small">
              Page {page} of 6. Both controls are plain lists and buttons, so
              screen readers announce them without extra ARIA.
            </p>
          </div>
        </Panel>

        <Panel
          className="span-4"
          kicker="// 12 telemetry"
          title="Metrics & identity"
          telemetry="HUD.12"
        >
          <div className="demo-grid">
            <Metric label="Street cred" value="72" delta="+4 this week" />
            <Metric
              label="Trace risk"
              value="23"
              unit="%"
              tone="danger"
              delta="ICE nearby"
            />
          </div>
          <Divider label="Operators" />
          <div className="demo-row">
            <Avatar name="V Silverhand" status="online" size="lg" />
            <Avatar name="Judy Alvarez" status="busy" />
            <Avatar name="Rogue Amendiares" status="offline" size="sm" />
            <Avatar name="Panam Palmer" />
          </div>
          <Divider label="Shortcuts" />
          <div className="demo-row">
            <Kbd>⌘</Kbd>
            <span className="mono-faint">+</span>
            <Kbd>K</Kbd>
            <span className="muted small">Open console</span>
          </div>
        </Panel>

        <Panel
          className="span-4"
          kicker="// 13 feedback"
          title="Tooltip & toasts"
          telemetry="POP.13"
        >
          <div className="demo-stack">
            <p className="muted small">
              Tooltips open on hover or keyboard focus. Toasts live in a fixed
              region and announce themselves.
            </p>
            <div className="demo-row">
              <Tooltip label="Opens the netrunner console">
                <Button variant="outline">Console</Button>
              </Tooltip>
              <Tooltip label="Wipes the local shard" side="bottom">
                <Button variant="danger">Purge</Button>
              </Tooltip>
            </div>
            <Button block onClick={pushToast}>
              Push notification
            </Button>
          </div>
        </Panel>

        <Panel
          className="span-4"
          kicker="// 14 disclosure"
          title="Accordion"
          telemetry="DET.14"
        >
          <Accordion
            defaultOpen="crew"
            items={[
              {
                id: "crew",
                title: "Crew roster",
                meta: "3 linked",
                children:
                  "Three operators on the channel: a solo, a netrunner and a techie. Native <details> does the toggling.",
              },
              {
                id: "gear",
                title: "Loadout",
                meta: "6 items",
                children:
                  "Malorian 3516, Kiroshi Mk.3, Sandevistan, MaxDocs and two EMP grenades.",
              },
              {
                id: "comms",
                title: "Comms protocol",
                meta: "encrypted",
                children:
                  "Use the relay, never the public grid. Rotate the key after every job.",
              },
            ]}
          />
        </Panel>

        <Panel
          className="span-12"
          kicker="// 15 states"
          title="Loading, skeletons & empty states"
          telemetry="STATE.15"
        >
          <div className="docs-grid">
            <div className="demo-stack">
              <Skeleton width="55%" height={14} />
              <Skeleton height={12} />
              <Skeleton height={84} />
              <div className="demo-row">
                <Spinner label="Loading" />
                <Spinner size="sm" label="Syncing" />
                <Spinner size="lg" label="Jacking in" />
              </div>
            </div>
            <EmptyState
              title="No contracts on the shard"
              action={
                <Button variant="outline" size="sm">
                  Refresh feed
                </Button>
              }
            >
              Adjust the district filters or wait for a fixer to ping your
              agent.
            </EmptyState>
          </div>
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

      <ToastStack
        items={toasts}
        onDismiss={(id) =>
          setToasts((current) => current.filter((item) => item.id !== id))
        }
      />
    </div>
  );
}
