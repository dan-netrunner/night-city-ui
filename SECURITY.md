# Security Policy

Night City UI is a presentational React component kit. It ships **no runtime
dependencies**, stores exactly one key in `localStorage` (`nc-theme`) and never
sends data anywhere. Keep that in mind when judging what counts as a vulnerability here.

## Supported versions

| Version | Supported |
| --- | --- |
| 0.1.x | yes |
| < 0.1 | no (unpublished) |

Only the latest release receives fixes. Because a version on npm can never be
replaced, a fix ships as a new patch version and the affected version is
deprecated with `npm deprecate`.

## Reporting a vulnerability

Open a **private vulnerability report**:
<https://github.com/dan-netrunner/night-city-ui/security/advisories/new>

Do not file a public issue for anything exploitable. You get an acknowledgement
within a week, and a fix or an honest "won't fix, here is why" shortly after.

## What we already watch

- `npm audit --omit=dev` runs in CI and must pass before any publish: the
  dependency surface consumers install has to be clean.
- `npm run audit:deps` (`scripts/audit-deps.mjs`) queries **OSV.dev for every
  package in the lockfile, development included**, and fails the build on any
  advisory. Exceptions live in [`osv-scanner.toml`](./osv-scanner.toml) and each
  one needs a written reason; the file currently holds none. The same command
  runs with `--self-test`, which requires a known-vulnerable fixture to be
  reported, so a changed API or a blocked network cannot fake a pass.
- Nothing is being ignored today: the last exception,
  [GHSA-fc5q-39xc-vjpf](https://github.com/advisories/GHSA-fc5q-39xc-vjpf)
  (ReDoS in `picomatch`, reached through `vite`), was **withdrawn upstream** and
  `npm audit` now reports zero advisories in the whole tree.
- Dependency lifecycle scripts are blocked unless allow-listed in
  `package.json` → `allowScripts`.
- Every release is published from GitHub Actions with npm provenance
  (OIDC trusted publishing, no long-lived token in the repo).

## Secrets and credentials policy

Nothing in this repository is a credential, and nothing that could become one
is ever stored here:

- The tree contains no `.npmrc`, no tokens and no auth configuration of any
  kind, and [`package.json`](./package.json) declares none.
- The npm release authenticates with **OIDC trusted publishing**:
  [`.github/workflows/publish-npm.yml`](./.github/workflows/publish-npm.yml)
  asks for `id-token: write` and runs `npm publish --provenance`. npm trades
  the workflow's short-lived OIDC token for a publish credential at run time,
  so the publishing workflow stores no npm token.
- The GitHub environment `npm` exists only as a deployment-protection gate;
  it holds no secrets and no variables.
- If a secret must exist at all, it lives in GitHub Actions secrets or in an
  environment — never in the repository. The only one today is the optional
  read-only `SCORECARD_REPO_TOKEN` consumed by `scorecard.yml`.
- **Secret scanning and push protection are enabled** on the repository, so
  a credential committed by mistake is caught at push time instead of
  landing in history.
- Dependency lifecycle scripts are blocked unless allow-listed in
  `package.json` → `allowScripts` (currently `esbuild@0.28.2`). That list is
  the practical control against a malicious package installing code through
  an install script: every addition appears in a diff and goes through
  review.

If a credential is ever leaked or rotated: revoke it at the provider first,
rotate it, then `npm deprecate` any version built or published with it —
npm artifacts cannot be recalled, only marked.

## Dependency and licence thresholds

What is enforced against the dependency surface, and how far:

- **Release gate.** CI and the publish workflow run two checks:
  `npm audit --omit=dev --audit-level=high` for what consumers inherit, and
  `npm run audit:deps` for the whole lockfile, development dependencies
  included. Either failing blocks the release.
- **Zero runtime dependencies.** The shipped package declares no
  `dependencies` at all (React is a peer dependency), so the advisory
  surface a consumer inherits is empty by construction.
- **Dev advisories block too.** They are no longer tolerated silently: an
  advisory on a development dependency fails `npm run audit:deps` unless it is
  listed in [`osv-scanner.toml`](./osv-scanner.toml) with a written reason and
  a scope note. The last entry,
  [GHSA-fc5q-39xc-vjpf](https://github.com/advisories/GHSA-fc5q-39xc-vjpf)
  (ReDoS in `picomatch` through `vite`, development scope only, never shipped),
  was removed when GitHub withdrew the advisory; the ignore list is empty.
- **Dependabot cadence.** Weekly, grouped into at most three open pull
  requests per ecosystem
  ([`.github/dependabot.yml`](./.github/dependabot.yml)). Major bumps of
  `vite`, `typescript` and `@vitejs/plugin-react` are deliberately ignored:
  those upgrades are reviewed as projects, not taken as scheduled updates.
- **Licence rule.** This project is MIT. No new dependency is accepted whose
  licence is not MIT/BSD/Apache-2.0-equivalent, and any new dependency —
  runtime or dev — requires an explicit decision recorded in its pull
  request. The default answer is no: see
  [`CONTRIBUTING.md`](./CONTRIBUTING.md), "No new runtime dependencies
  beyond React".

## SAST findings policy

Static analysis, and what happens to its results:

- [`.github/workflows/codeql.yml`](./.github/workflows/codeql.yml) runs
  CodeQL with the `security-and-quality` query pack over the source
  (`javascript-typescript`) and over the workflow files themselves
  (`actions`), on push, on pull request and weekly.
- Results land in the repository
  [Security tab](https://github.com/dan-netrunner/night-city-ui/security/code-scanning).
- **Threshold.** Any high or critical alert on the default branch is fixed
  before the next release. Medium alerts get an issue. Suppressing a finding
  requires a written justification in the code plus a link to the alert —
  a bare suppression comment is not a review.
- **Enforcement that exists today.** CodeQL is a required status check on
  `main` (`Analyze javascript-typescript`, `Analyze actions`), as is the
  `build` check; TypeScript compiles with `strict`, `noUnusedLocals` and
  `noUnusedParameters`; releases are cut only from `main` — so nothing
  reaches a release without passing all of it.
