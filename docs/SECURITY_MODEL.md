# Security model

Honest scope of a presentational component kit. Written against `main`; every
claim below is backed by a command that can be re-run, and the artifact bindings
match the published `night-city-ui` releases.

## What it is / trust boundary

`night-city-ui` is a React + TypeScript component kit: rendering functions,
CSS custom properties, zero runtime dependencies. What ships is JavaScript
that executes **inside the consumer's own bundle** — installing it means
trusting its code with your application's full privileges. That trust is
established through provenance and review
([VERIFYING_A_RELEASE.md](./VERIFYING_A_RELEASE.md)), not through sandboxing:
there is no boundary between this kit's code and yours at runtime.

The **application is trusted; its data is not.** The kit assumes the developer
who renders a component is authorized to run code, but string and node values
flowing into props (`children`, labels, `href`, `src`, code text) may be
attacker-influenced end-user data. The kit's job is to never provide a sink
that interprets such data as code or markup; the application's job is to not
feed dangerous URL schemes into the URL props that legitimately exist.

## Actors and actions

| Actor | Controls | Can inject | Cannot |
|---|---|---|---|
| End user (browser) | Nothing in the kit; supplies data the app passes as props | Prop values (labels, `href`, `src`, `code`) | Execute markup: all text is React-escaped; no raw-HTML API exists |
| Application developer | Bundle, prop values, theme CSS overrides, what data reaches props | Arbitrary code by their own choice (they own the app) | Blame the kit for `javascript:` URLs they passed to `href` — sanitisation is the app's job |
| Contributor (PR) | Source changes until merge | Only reviewed diffs; `main` requires 2 approving reviews | Direct pushes to `main`; publishing (CI-only, see below) |
| CI (GitHub Actions) | The published artifact: build, test, audit, `npm publish --provenance` from `main` | Only what a merged commit to `main` contains | Publishing without the OIDC identity of this repo + `npm` environment; any human acting as the package |
| npm registry | Serving the tarball, registry signatures, hosting attestations | Package visibility/mirroring | Change content undetected (integrity hash + provenance digest cover it) |
| Sigstore / Rekor | Transparency log for the attestation signature | Nothing — append-only audit log | Retroactively alter or delete entries |

## Assets handled

**None over the network.** The library code performs no `fetch`, `XMLHttpRequest`,
`WebSocket`, `EventSource` or `sendBeacon` — it makes no third-party requests
and loads no remote resources itself:

```text
$ grep -rn "fetch(\|XMLHttpRequest\|WebSocket\|EventSource\|navigator.sendBeacon" src/
(no matches — the demo pages under src/pages/ are not part of the published entry)
```

**Only client-side storage:** one key. `src/theme.tsx` writes
`localStorage.setItem(STORAGE_KEY, id)` (line 97) with
`const STORAGE_KEY = "nc-theme"` (line 73), wrapped in try/catch. The value is
always one of the kit's own `ThemeId` literals, and it is only ever read back
as a theme name — no secrets, no PII, no structured data.

**Browser APIs used besides rendering:** `document.documentElement.dataset.theme`
and `meta[name="theme-color"]` (theme.tsx), `document.body.style.overflow`
while a `Modal` is open (Modal.tsx, restored on close), and
`navigator.clipboard.writeText` behind `CodeBlock`'s copy button — which
copies back the `code` prop the application itself passed in.

## Attack surface and analysis

Reachable sinks in the published code, exhaustively:

- **React-rendered text** (all components): escaped by React — user data
  cannot break out into markup. `CodeBlock` renders its `code` prop as
  `<pre><code>{code}</code></pre>`: plain text, no syntax-highlighter parser,
  no `dangerouslySetInnerHTML`.
- **`Avatar` `src`** (`Display.tsx`): passed to `<img src>`. A hostile URL is
  a tracking/content problem, not script execution.
- **`Breadcrumbs`/`Crumb` `href`** (`Nav.tsx`): passed to `<a href>`. **This is
  the one property-style sink.**
- **`Pagination`** (`Nav.tsx`): only `<button type="button">` calling
  `onChange(page: number)` — callbacks and numbers, no URLs at all.
- **`Tooltip`, `Modal`, `Tabs`** and every other component take `ReactNode`
  props (`children`, `label`, `title`, `footer`). There is **no raw-HTML prop
  anywhere in the kit**; grep finds no `dangerouslySetInnerHTML`, `innerHTML`,
  `document.write`, `eval` or `new Function` in `src/`:

  ```text
  $ grep -rn "dangerouslySetInnerHTML\|innerHTML\|document\.write\|eval(\|new Function" src/
  (no matches)
  ```

**Explicit guidance to consumers:** do not pass user-controlled `javascript:`
or `data:` URLs to `href`/`src` props. React's escaping neutralises markup
breakout but **does not neutralise URL schemes**; validating or sanitising
those is the application's job (allow-list `https:`/`http:`/relative for
user-supplied links).

**CSS:** custom properties come from the theme author (the application's
stylesheet / `tokens.css` overrides), never from end users — overriding design
tokens is a maintainer action performed at build time. `ThemeProvider` writes
`data-theme` on `<html>`, which selects one of the four built-in stylesheets;
it cannot be steered by prop data.

**What is *not* attack surface:** no authentication state, no session or
credential handling, no parsers for complex untrusted formats (there is no
input grammar beyond TypeScript types), no native or memory-unsafe code, no
workers, no postMessage handlers.

## Supply chain

- **Zero runtime dependencies**; the published tarball carries only `dist/`
  files whitelisted in `package.json` `files`. `npm audit --omit=dev` is a
  hard gate in the publish workflow.
- **Committed lockfile**, installed in CI with `npm ci`.
- **`allowScripts`**: only `esbuild@0.28.2` may run install scripts during
  `npm ci` (pinned dev-tree exception; every other install script is denied).
- **Publishing** is OIDC trusted publishing from GitHub Actions with
  `npm publish --provenance` — no stored npm token; see
  [VERIFYING_A_RELEASE.md](./VERIFYING_A_RELEASE.md).
- **Dependabot** alerts and version updates for npm and Actions weekly.
  (Automatically-submitted security pull requests remain off in repo settings —
  with zero runtime dependencies there is no consumer-facing advisory for one to
  fix.)
- **Secret scanning with push protection** is enabled on the repository.
- **CodeQL** (`security-and-quality` suite) runs over `javascript-typescript`
  and workflow files on push and weekly.
- **No open advisories anywhere in the tree.** The one that used to be listed
  here, `picomatch` ≤ 4.0.7 (GHSA-fc5q-39xc-vjpf, ReDoS, reachable through
  `vite`/`vitest` in the *development* tree only), was withdrawn upstream, and
  it was never part of the published package. `npm run audit:deps` now blocks a
  release on a development advisory too, unless `osv-scanner.toml` records a
  reason for it.

## Known limitations / out of scope

- This kit is **not an authentication or data-handling layer**. It holds no
  sessions and validates nothing about the data you render.
- It does **not** defend against an application that renders untrusted HTML
  (`dangerouslySetInnerHTML`, `innerHTML`) around or beside the components —
  the sink then lives in the application.
- URL-scheme validation is **out of scope by design** (see the `href`/`src`
  guidance above); React escaping is not a URL sanitiser.
- **No fuzzing.** There is no native parser and no memory-unsafe code to fuzz;
  the input space is typed React props, covered by unit and property-based
  tests instead.
- **SBOM**: each GitHub Release attaches a CycloneDX 1.5 document of the runtime
  graph, which is empty on purpose (no runtime dependencies); npm provenance is the
  binding for the registry artifact. See
  [VERIFYING_A_RELEASE.md](./VERIFYING_A_RELEASE.md) for both.
- **Visual spoofing is not mitigated by code:** a theme (or an application's
  CSS override) that imitates browser chrome or another site is a design
  concern the kit cannot detect or prevent.

Found something not covered here? Report it privately via
[SECURITY.md](../SECURITY.md).
