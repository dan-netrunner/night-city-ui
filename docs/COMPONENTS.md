# Night City UI — Component API Reference

English reference for the complete public API of the `night-city-ui` package.
Every export of `src/index.ts` is documented here with its props, the native
element it renders and its accessibility behaviour. The interactive demos on
[the docs site](https://dan-netrunner.github.io/night-city-ui/#/components)
cover a subset; this file is the authority for prop names, types and defaults.
A Spanish guide with theming walkthroughs lives in
[GUIA_DE_USO.md](../GUIA_DE_USO.md).

## Install

```bash
npm install night-city-ui
```

```tsx
import "night-city-ui/style.css";
import { Button } from "night-city-ui";
```

React >= 18 is the only peer requirement. Fonts are not bundled; the CSS falls
back to system fonts.

## Styling contract

Components render semantic HTML and add `cp-*` class names; they carry no
inline theme values. Structure and behaviour live in `src/styles/ui.css`,
all visual values (colors, radii, fonts, shadows, corner clips) in
`src/styles/tokens.css` as CSS custom properties, redefined per theme.
Restyling means overriding tokens; the markup and class names are stable.

## Contents

- [Actions and surfaces](#actions-and-surfaces): Button, Panel, Modal
- [Forms](#forms): Input, Textarea, Select, Checkbox, Radio, Toggle, Slider
- [Feedback](#feedback): Badge, Progress, Alert, Tooltip, Toast, ToastStack, Spinner, Skeleton, EmptyState
- [Navigation and disclosure](#navigation-and-disclosure): Tabs, Accordion, Breadcrumbs, Pagination
- [Content](#content): Divider, Kbd, Avatar, Metric, CodeBlock
- [Theming](#theming): ThemeProvider, useTheme, THEMES, ThemeId, ThemeMeta
- [CSS surface](#css-surface): stylesheet, `data-theme`, design tokens

All components are named exports of `night-city-ui`. Each also exports a
`ComponentNameProps` type. Where a table lists `...rest`, the component
spreads the named native HTML attribute set onto its root element.

---

## Actions and surfaces

### Button

Renders `<button type="button">` with `cp-btn` classes. The `code` stamp is
`aria-hidden`; the children render inside `cp-btn__label`. Native role
`button`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"primary" \| "ghost" \| "outline" \| "danger"` | `"primary"` | Visual variant. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Height and type scale. |
| `block` | `boolean` | `false` | Stretch the button to the full container width. |
| `code` | `string` | — | Micro-telemetry tag rendered before the label (e.g. `"01"`), decorative. |
| `type` | `"button" \| "submit" \| "reset"` | `"button"` | Native button type. |
| `className` | `string` | `""` | Appended to the `cp-btn` classes. |
| `children` | `ReactNode` | — | Button label. |
| `...rest` | `ButtonHTMLAttributes<HTMLButtonElement>` | — | All native button attributes (`disabled`, `onClick`, ...). |

### Panel

Renders a `<div>` shell with optional head (`cp-panel__kicker`, title as
`h2.cp-panel__title`, actions slot), body and footer. The head renders only
when at least one of `title`, `kicker`, `actions`, `telemetry` is set. No
ARIA role; plain grouping markup.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | — | Panel title, rendered as `<h2>`. |
| `kicker` | `string` | — | Small label above the title. |
| `actions` | `ReactNode` | — | Content in the head's right slot (e.g. buttons, badges). |
| `footer` | `ReactNode` | — | Content in a separate foot strip. |
| `telemetry` | `string` | — | Corner stamp in the actions slot, `aria-hidden`. |
| `accent` | `boolean` | `false` | Accent-border variant. |
| `flush` | `boolean` | `false` | Remove body padding (for tables and grids). |
| `className` | `string` | `""` | Appended to the `cp-panel` classes. |
| `children` | `ReactNode` | — | Body content. |
| `...rest` | `HTMLAttributes<HTMLDivElement>` | — | All native div attributes. |

### Modal

Wraps the native `<dialog>` element, opened with `showModal()`: focus is
trapped by the browser, Esc fires `onClose` (the `cancel` event is
`preventDefault`ed), and `document.body` scroll is locked while open.
Clicking the backdrop (the dialog itself) calls `onClose`. `aria-labelledby`
points at the title `<h2>`; the built-in dismiss button carries
`aria-label="Close dialog"` and is a ghost `Button`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `open` | `boolean` | — | Required. Show the dialog (controlled). |
| `onClose` | `() => void` | — | Required. Called by Esc, backdrop click and the close button. |
| `title` | `ReactNode` | — | Required. Dialog heading and accessible name. |
| `kicker` | `string` | — | Small label above the title. |
| `children` | `ReactNode` | — | Body content. |
| `footer` | `ReactNode` | — | Footer slot for actions. |

---

## Forms

The `Input`, `Textarea` and `Select` components share a field wrapper: an
optional `<label>` bound by `htmlFor`, the control, and one message paragraph
(`cp-field__msg`) rendered from `error ?? hint`. The message id is wired to
`aria-describedby`, and `aria-invalid` is set when `error` is present. The
`id` is generated with `useId()` when not provided.

### Input

Renders `<div class="cp-field">` + `<input class="cp-input">`. Native role
`textbox` (or the role implied by `type`).

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` | — | Visible label bound to the input. |
| `hint` | `ReactNode` | — | Helper text below the input. |
| `error` | `ReactNode` | — | Error text; replaces `hint` and sets `aria-invalid`. |
| `id` | `string` | auto (`useId`) | Input id; also the label/message wiring. |
| `className` | `string` | `""` | Added to the wrapper div, not the input. |
| `...rest` | `InputHTMLAttributes<HTMLInputElement>` | — | All native input attributes (`value`, `onChange`, `placeholder`, ...). |

### Textarea

Same field wrapper as `Input`, renders `<textarea class="cp-input cp-textarea">`.
Native role `textbox` (multiline).

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` | — | Visible label bound to the textarea. |
| `hint` | `ReactNode` | — | Helper text below the textarea. |
| `error` | `ReactNode` | — | Error text; replaces `hint` and sets `aria-invalid`. |
| `id` | `string` | auto (`useId`) | Textarea id. |
| `rows` | `number` | `4` | Visible text rows. |
| `className` | `string` | `""` | Added to the wrapper div. |
| `...rest` | `TextareaHTMLAttributes<HTMLTextAreaElement>` | — | All native textarea attributes. |

### Select

Renders the field wrapper plus `<div class="cp-select"><select class="cp-input">`.
Options come from `children`. Native role `combobox`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` | — | Visible label bound to the select. |
| `hint` | `ReactNode` | — | Helper text below the select. |
| `error` | `ReactNode` | — | Error text; replaces `hint` and sets `aria-invalid`. |
| `id` | `string` | auto (`useId`) | Select id. |
| `children` | `ReactNode` | — | `<option>` / `<optgroup>` elements. |
| `className` | `string` | `""` | Added to the wrapper div. |
| `...rest` | `SelectHTMLAttributes<HTMLSelectElement>` | — | All native select attributes (`value`, `onChange`, ...). |

### Checkbox

Renders a `<label class="cp-check">` wrapping `<input type="checkbox">`;
the styled box is a decorative `aria-hidden` span. Native role `checkbox`;
the label text is the accessible name.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` | — | Required. Clickable label text. |
| `hint` | `ReactNode` | — | Small text under the label. |
| `id` | `string` | auto (`useId`) | Input id; the label's `htmlFor`. |
| `className` | `string` | `""` | Added to the label element. |
| `...rest` | `InputHTMLAttributes<HTMLInputElement>` | — | All native checkbox attributes (`checked`, `defaultChecked`, `onChange`, ...). |

### Radio

Same label-wrapped pattern as `Checkbox`, renders `<input type="radio">`;
the styled dot is decorative. Native role `radio`; group radios by sharing a
`name`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` | — | Required. Clickable label text. |
| `hint` | `ReactNode` | — | Small text under the label. |
| `id` | `string` | auto (`useId`) | Input id. |
| `className` | `string` | `""` | Added to the label element. |
| `...rest` | `Omit<InputHTMLAttributes<HTMLInputElement>, "type">` | — | All native radio attributes; `type` is fixed. |

### Toggle

Switch-style checkbox: `<input type="checkbox" role="switch">` inside a
`<label class="cp-toggle">`; track and thumb are decorative spans. Exposed
to assistive tech as a `switch`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` | — | Required. Label text. |
| `hint` | `ReactNode` | — | Small text under the label. |
| `id` | `string` | auto (`useId`) | Input id. |
| `className` | `string` | `""` | Added to the label element. |
| `...rest` | `InputHTMLAttributes<HTMLInputElement>` | — | All native checkbox attributes. |

### Slider

Range input with a live `<output>` readout (`value` + `suffix`). Works
controlled (`value`) or uncontrolled (`defaultValue`, internal state).
Native role `slider`. The label is bound with `htmlFor`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` | — | Field label; falls back to an empty slot. |
| `value` | `number` | — | Controlled current value. |
| `defaultValue` | `number` | `min` | Uncontrolled initial value. |
| `min` | `number` | `0` | Lower bound. |
| `max` | `number` | `100` | Upper bound. |
| `suffix` | `string` | `"%"` | Text appended to the value in the readout. |
| `onChange` | `ChangeEventHandler<HTMLInputElement>` | — | Fired on every change. |
| `id` | `string` | auto (`useId`) | Input id. |
| `className` | `string` | `""` | Added to the wrapper div. |
| `...rest` | `Omit<InputHTMLAttributes<HTMLInputElement>, "type" \| "value" \| "defaultValue" \| "onChange" \| "min" \| "max">` | — | Remaining native range attributes. |

---

## Feedback

### Badge

Renders `<span class="cp-badge">` with tone/solid/pulse modifiers. The pulse
status node is `aria-hidden`. No ARIA role; treat it as inline text.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `tone` | `"neutral" \| "accent" \| "ok" \| "warn" \| "danger"` | `"neutral"` | Colour tone. |
| `solid` | `boolean` | `false` | Filled variant using the tone's ink token. |
| `pulse` | `boolean` | `false` | Pulsing HUD node before the label, decorative. |
| `className` | `string` | `""` | Appended to the `cp-badge` classes. |
| `children` | `ReactNode` | — | Badge text. |
| `...rest` | `HTMLAttributes<HTMLSpanElement>` | — | All native span attributes. |

### Progress

Renders a meta row (label + rounded percentage) and a bar with
`role="progressbar"` and `aria-valuemin/max/now`. `value` is clamped to
`0..max`; a non-positive `max` falls back to `100`. In segmented mode the
bar is discrete cells instead of a continuous fill. `aria-label` is set only
when `label` is a string.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `value` | `number` | — | Required. Current value, clamped to `0..max`. |
| `max` | `number` | `100` | Upper bound. |
| `label` | `ReactNode` | — | Text before the bar; also the accessible name when a string. |
| `showValue` | `boolean` | `true` | Render the computed percentage. |
| `tone` | `"accent" \| "ok" \| "warn" \| "danger"` | `"accent"` | Fill colour. |
| `segmented` | `boolean` | `false` | Discrete HUD segments instead of a continuous bar. |
| `segments` | `number` | `12` | Segment count, clamped to 4–24. |
| `className` | `string` | `""` | Appended to the `cp-progress` class. |

### Alert

Renders `<div class="cp-alert">` with a tone glyph (`aria-hidden`), title,
body and optional dismiss button (`aria-label="Dismiss message"`). Role is
`alert` when `tone="danger"`, otherwise `status`. The component is presentational:
control visibility with `onDismiss` in the parent.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `tone` | `"info" \| "ok" \| "warn" \| "danger"` | `"info"` | Severity, sets colour, glyph and role. |
| `title` | `ReactNode` | — | Heading line. |
| `children` | `ReactNode` | — | Body text. |
| `onDismiss` | `() => void` | — | When set, renders the dismiss button. |
| `className` | `string` | `""` | Appended to the `cp-alert` classes. |

### Tooltip

Wraps a single trigger element in `<span class="cp-tooltip">` plus a bubble
with `role="tooltip"`. The trigger receives `aria-describedby` with the
bubble id (merged with any existing value). The trigger must be focusable
(button, link, input) so the bubble opens on keyboard focus as well as hover.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` | — | Required. Tooltip content. |
| `children` | `ReactNode` | — | Required. The focusable trigger element. |
| `side` | `"top" \| "bottom"` | `"top"` | Bubble placement. |
| `className` | `string` | `""` | Appended to the wrapper classes. |

### Toast

Standalone notification card: `<div>` with tone icon (`aria-hidden`), title,
body and optional dismiss button (`aria-label="Dismiss notification"`).
Role is `alert` when `tone="danger"`, otherwise `status`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | — | Required. Toast heading. |
| `children` | `ReactNode` | — | Body text. |
| `tone` | `"info" \| "ok" \| "warn" \| "danger"` | `"info"` | Severity, sets colour, glyph and role. |
| `onDismiss` | `() => void` | — | When set, renders the dismiss button. |
| `className` | `string` | `""` | Appended to the `cp-toast` classes. |

### ToastStack

Renders a list of `Toast`s inside `<div class="cp-toasts" role="region"
aria-label={label}>`. Returns `null` when `items` is empty. Toast state
(add/remove, auto-dismiss timing) belongs to the caller.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `ToastItem[]` | — | Required. `{ id: string; title: ReactNode; message?: ReactNode; tone?: "info" \| "ok" \| "warn" \| "danger" }`. |
| `onDismiss` | `(id: string) => void` | — | Required. Called with the item id when its dismiss button is clicked. |
| `label` | `string` | `"Notifications"` | Accessible name of the region. |
| `className` | `string` | `""` | Appended to the `cp-toasts` class. |

### Spinner

Renders `<span role="status">` wrapping an `aria-hidden` rotating element and
the visible `label` text, which is the accessible content.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `"Loading"` | Text announced with the spinner. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Diameter. |
| `className` | `string` | `""` | Appended to the wrapper classes. |

### Skeleton

Loading placeholder: `<span class="cp-skeleton" aria-hidden="true">` sized by
inline `width`/`height` props (CSS length units accepted).

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `width` | `string \| number` | — | Box width (numbers are px). |
| `height` | `string \| number` | — | Box height (numbers are px). |
| `className` | `string` | `""` | Appended to the `cp-skeleton` class. |

### EmptyState

Placeholder for content-free views: decorative glyph, title, body and an
optional action slot. No ARIA role.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | — | Required. Heading line. |
| `children` | `ReactNode` | — | Body text. |
| `glyph` | `ReactNode` | `"//"` | Large decorative mark, `aria-hidden`. |
| `action` | `ReactNode` | — | Slot below the text (e.g. a `Button`). |
| `className` | `string` | `""` | Appended to the `cp-empty` class. |

---

## Navigation and disclosure

### Tabs

Tab list only: `div[role="tablist"]` of `button[role="tab"]` elements with
`aria-selected`, roving `tabIndex` (active tab is `0`) and ArrowLeft /
ArrowRight navigation. Panels are the caller's responsibility — render the
selected content yourself and wire `aria-labelledby`/`role="tabpanel"` as in
the docs site.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `TabItem[]` | — | Required. `{ id: string; label: ReactNode; count?: number \| string }`; `count` renders as a suffix chip. |
| `value` | `string` | — | Required. `id` of the selected tab (controlled). |
| `onChange` | `(id: string) => void` | — | Required. Called on click and arrow-key selection. |
| `label` | `string` | — | Required. Accessible name of the tablist (`aria-label`). |
| `className` | `string` | `""` | Appended to the `cp-tabs` class. |

### Accordion

Native disclosure widget: one `<details>` per item with a `<summary>`
(title + optional meta + `aria-hidden` chevron) and a body div. No JavaScript
state; browsers handle expand/collapse and its semantics.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `AccordionItem[]` | — | Required. `{ id: string; title: ReactNode; meta?: ReactNode; children: ReactNode }`. |
| `defaultOpen` | `string` | — | `id` of the item rendered `open` on mount. |
| `className` | `string` | `""` | Appended to the `cp-accordion` class. |

### Breadcrumbs

`<nav aria-label={label}>` around an `<ol>`. Every item with an `href`
renders `<a>` except the last, which renders `<span aria-current="page">`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `Crumb[]` | — | Required. `{ label: ReactNode; href?: string }`; last item is the current page. |
| `label` | `string` | `"Breadcrumb"` | Accessible name of the nav landmark. |
| `className` | `string` | `""` | Appended to the `cp-breadcrumbs` class. |

### Pagination

`<nav aria-label={label}>` with Prev / numbered / Next `type="button"`
buttons. The current page gets `aria-current="page"`; Prev and Next are
`disabled` at the bounds. `pageCount` is floored at 1 and every page number
is rendered.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `page` | `number` | — | Required. Current page, 1-based (controlled). |
| `pageCount` | `number` | — | Required. Total pages; values below 1 render as 1. |
| `onChange` | `(page: number) => void` | — | Required. Called with the clicked page number. |
| `label` | `string` | `"Pagination"` | Accessible name of the nav landmark. |
| `className` | `string` | `""` | Appended to the `cp-pagination` class. |

---

## Content

### Divider

`<div role="separator">`, optionally with a centred label (adds
`cp-divider--label`).

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` | — | Text embedded in the rule. |
| `className` | `string` | `""` | Appended to the `cp-divider` classes. |

### Kbd

Presentational wrapper over `<kbd>` for keyboard shortcuts, styled with
`cp-kbd`. Adds no props of its own.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `className` | `string` | `""` | Appended to the `cp-kbd` class. |
| `children` | `ReactNode` | — | Key or combo text. |
| `...rest` | `HTMLAttributes<HTMLElement>` | — | All native attributes for the `kbd` element. |

### Avatar

`<span role="img" aria-label={name}>` showing `src` (with `alt=""`, the
wrapper carries the name) or initials computed from `name` (first letters of
the first two words, uppercased). Optional status dot, `aria-hidden`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `name` | `string` | — | Required. Person name; becomes the accessible name and the initials. |
| `src` | `string` | — | Image URL; falls back to initials. |
| `status` | `"online" \| "busy" \| "offline"` | — | Colour-coded presence dot. |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Diameter. |
| `className` | `string` | `""` | Appended to the `cp-avatar` classes. |

### Metric

Stat readout: `<div>` with label, value, optional unit suffix, optional
delta line. Colour comes from `tone`. No ARIA role.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `ReactNode` | — | Required. Metric caption. |
| `value` | `ReactNode` | — | Required. Main figure. |
| `unit` | `string` | — | Small suffix after the value. |
| `delta` | `ReactNode` | — | Change/context line. |
| `tone` | `"accent" \| "ok" \| "warn" \| "danger"` | `"accent"` | Accent colour. |
| `className` | `string` | `""` | Appended to the `cp-metric` classes. |

### CodeBlock

Displays a code string in `<pre><code>` with a header bar and a Copy button
(the header button, not the snippet, carries `aria-live="polite"`; it uses
`navigator.clipboard` and shows "Copied // OK" for 1.8 s; failures are
silent).

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `code` | `string` | — | Required. Snippet text; also what is copied. |
| `label` | `string` | `"JSX // SNIPPET"` | Text in the header bar. |
| `className` | `string` | `""` | Appended to the `cp-code` class. |

---

## Theming

Exported from `src/theme.tsx` (`index.ts` re-exports it). The four skins are
pure CSS; `ThemeProvider` only manages which one is active.

### ThemeProvider

Context provider around any subtree that uses `useTheme`. On mount it reads
`document.documentElement.dataset.theme` (falls back to `"neokitsch"`), keeps
the theme in state, and writes it back to the `data-theme` attribute of
`<html>`. `setTheme(id)` additionally updates `<meta name="theme-color">` and
persists the id in `localStorage` under `"nc-theme"` (silently skipped in
private mode).

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | — | Required. The themed subtree. |

### useTheme

Hook returning the current theme context; throws
`"useTheme must be used inside <ThemeProvider>"` outside a provider.

| Field | Type | Description |
| --- | --- | --- |
| `theme` | `ThemeId` | Active theme id. |
| `setTheme` | `(id: ThemeId) => void` | Switch the theme (updates DOM, meta and storage). |
| `meta` | `ThemeMeta` | Metadata of the active theme. |

### THEMES

`ThemeMeta[]` — the four built-in skins, in the order entropism, kitsch,
neomilitarism, neokitsch. Map over it to build switchers (see `App.tsx`).

### ThemeId

```ts
type ThemeId = "entropism" | "kitsch" | "neomilitarism" | "neokitsch";
```

| Id | Display name | Era |
| --- | --- | --- |
| `"entropism"` | Scrap//Tech | 2000s — 2050s |
| `"kitsch"` | Tacky//Futurism | 2060s — 2070s |
| `"neomilitarism"` | Corpo//Brutalism | 2070s |
| `"neokitsch"` | Hyper//Opulence | 2077 |

### ThemeMeta

Shape of each `THEMES` entry (exported type):

| Field | Type | Description |
| --- | --- | --- |
| `id` | `ThemeId` | Theme identifier. |
| `name` | `string` | Display name. |
| `era` | `string` | Fictional era label. |
| `tagline` | `string` | One-line pitch. |
| `description` | `string` | Paragraph describing the skin. |
| `swatches` | `string[]` | Representative hex colours. |
| `traits` | `string[]` | Visual characteristics. |

---

## CSS surface

### Stylesheet

The package ships one stylesheet, imported once (usually at the app entry):

```ts
import "night-city-ui/style.css";
```

It is the build output of `src/styles/tokens.css` (values) + `src/styles/ui.css`
(structure, `cp-*` classes). No CSS-in-JS, no per-component imports.

### `data-theme` attribute

Every token set is keyed by the `data-theme` attribute, which works on any
element (`<html>` for the whole app, a subtree for a local skin):

```html
<html data-theme="entropism">
```

Accepted values are the four ids from [ThemeId](#themeid): `entropism`
(Scrap//Tech), `kitsch` (Tacky//Futurism), `neomilitarism`
(Corpo//Brutalism), `neokitsch` (Hyper//Opulence, also the `:root` default).

### Design tokens

`src/styles/tokens.css` declares the same 46 custom properties on every
theme; overriding them on a `data-theme` element re-skins the components.
Values below are the `neokitsch` (`:root`) defaults.

Surfaces and text:

| Token | Role |
| --- | --- |
| `--bg` | Page background colour. |
| `--bg-2` | Secondary surface colour. |
| `--panel` | Panel/component surface. |
| `--panel-2` | Raised panel surface. |
| `--ink` | Primary text colour. |
| `--ink-dim` | Secondary text colour. |
| `--ink-faint` | Muted text colour. |
| `--line` | Default border colour. |
| `--line-strong` | Emphasised border colour. |
| `--accent` | Primary accent colour. |
| `--accent-2` | Secondary accent colour. |
| `--accent-ink` | Text colour on `--accent` fills. |
| `--accent-ghost` | Translucent accent for tints. |
| `--ok` | Success tone colour. |
| `--ok-ink` | Text colour on `--ok` fills. |
| `--warn` | Warning tone colour. |
| `--warn-ink` | Text colour on `--warn` fills. |
| `--danger` | Danger tone colour. |
| `--danger-ink` | Text colour on `--danger` fills. |

Geometry:

| Token | Role |
| --- | --- |
| `--radius` | General corner radius. |
| `--radius-sm` | Small corner radius. |
| `--radius-btn` | Button corner radius. |
| `--border-w` | Component border width. |

Typography:

| Token | Role |
| --- | --- |
| `--font-display` | Display/heading family. |
| `--font-ui` | UI controls family. |
| `--font-body` | Body text family. |
| `--font-mono` | Monospace/data family. |
| `--display-weight` | Heading font weight. |
| `--display-tracking` | Heading letter-spacing. |

Effects and backgrounds:

| Token | Role |
| --- | --- |
| `--panel-shadow` | Panel drop/inset shadow. |
| `--btn-shadow` | Button shadow (rest state). |
| `--btn-shadow-hover` | Button shadow (hover state). |
| `--glow` | Ambient accent glow. |
| `--focus-glow` | Focus ring glow. |
| `--field-bg` | Form field background. |
| `--panel-head-bg` | Panel head background. |
| `--panel-foot-bg` | Panel foot background. |
| `--slider-thumb-radius` | Range thumb radius. |
| `--modal-backdrop` | `<dialog>` backdrop colour. |
| `--bar-bg` | Sticky top bar background. |
| `--page-bg` | Layered page background image. |
| `--noise-opacity` | Opacity of the `.app-noise` overlay. |

Clip paths (the chamfered/cut corner shapes, used via `clip-path`):

| Token | Role |
| --- | --- |
| `--clip-btn` | Button corner clip. |
| `--clip-panel` | Panel corner clip. |
| `--clip-tab` | Tab corner clip. |
| `--clip-mark` | Brand mark (`NC`) shape clip. |

---

*This reference mirrors `src/components/index.ts` and `src/theme.tsx`. If you
change a public prop, update this file in the same pull request.*
