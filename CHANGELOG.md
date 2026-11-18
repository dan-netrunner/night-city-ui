# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[semantic versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- The badge answers were audited criterion by criterion and the entry is now fully authored by
  this repository: 45 more statuses (level-2 criteria, plus `discussion`, `interfaces_current`,
  `accessibility_best_practices`, `code_review_standards`, the coverage criteria at 90/80 and the
  crypto criteria that are genuinely not applicable) and 30 justifications rewritten where the
  badge site's own autofill had left machine text ("Non-trivial contribution file in repository",
  "No appropriate folder found for documentation basics", "Repository on GitHub, which uses git").
  Level 1 goes from 69% to 89% and level 2 from 17% to 39%; level 0 and Baseline level 1 stay at
  100%. Twenty-two criteria are answered `Unmet` on evidence rather than left blank, and each
  justification says what would close it.
- `OSPS-BR-01.02` is not in the answers: the control was retired upstream
  (`criteria/baseline_criteria_retired.yml`), the column still exists but is no longer gradeable.

- The badge entry now answers the **silver-level** criteria too: 37 classic level-1 MUSTs plus
  `two_person_review`, each with a justification that points at a file, a workflow or a
  measurement. Projected against the site's own grading rules that moves the entry from 15% to 69%
  at level 1 while level 0 and Baseline level 1 stay at 100%. Six are recorded `Unmet` because they
  are not done — no named style guide, no automatic style enforcement, no regression test on one of
  the two behaviour fixes, no input validation, no roadmap, no continuity plan — and each
  justification says what would close it. Three of the `Met` answers point at the two pages added
  in the same release, below.
- The README now links the badges the project has earned: [OpenSSF Best Practices
  `passing`](https://www.bestpractices.dev/projects/16895) and
  [OpenSSF Baseline level 1](https://www.bestpractices.dev/projects/16895). The badge program asks
  projects to publish achievements on the front page, and the criteria say within 48 hours of
  recognition.
- [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md): the layer order (tokens → styles → components
  → theme → entry), how a skin switch is one attribute and no rebuild, the two builds from one
  source tree, what the public surface is, and the measured rebuild check (two clean
  `npm run build:lib` runs produced 16 files with identical sha256 per file).
- A **Governance and roles** section in `CONTRIBUTING.md`: who holds authority, what a contributor
  and a reporter are responsible for, how a decision is actually made, and what changes when a
  second maintainer arrives. It documents the limits honestly — single owner, no second reviewer,
  no continuity plan.
- `.bestpractices.json` now answers the badge's classic (non-OSPS) criteria for the passing
  level too — 43 criteria with a justification each, `N/A` where cryptography is out of scope
  for a component kit and `Unmet` where it is simply not done (no dynamic analysis, no
  assertion build).
- `scripts/bestpractices-sync.py`, a local helper that writes those answers through the badge
  site's own edit forms (one PATCH per section), asks for the 48-hour session cookie with
  `getpass` so it never reaches the shell history, and re-reads the public JSON afterwards to
  decide whether it worked.
- Test coverage gate. `npm run test:coverage` instruments the shipped surface
  (`src/components/*.tsx` and `src/theme.tsx`; the docs-site pages and the demo workbench are
  excluded because they are not part of the package) and CI enforces 90% statements, 80%
  branches, 85% functions and 90% lines, posting the measured numbers to the run summary.
  Current suite: 92.99% statements (146/157), 84.03% branches, 91.8% functions, 96.4% lines.

### Fixed
- Badge answers: the `OSPS-*` keys in `.bestpractices.json` used the display form the public
  JSON prints (`OSPS-AC-01.01_status`) instead of the column names the site accepts
  (`osps_ac_01_01_status`), so every one of the 64 controls was silently ignored when the site
  read the file. Renamed. Nine `<criterion>_url` keys were removed for the same reason — that is
  not a field: a criterion that requires a URL reads it from its `*_justification`, so
  `vulnerability_report_process` and `vulnerability_report_private` (both `MUST` at the passing
  level) would have been written as `Met` and graded "URL required" instead of met, keeping the
  entry short of `passing`.
- The header no longer reflows when the active theme changes: the theme switcher keeps
  its position at every width, showing the theme labels only where the row has room for
  them (1280px and up).

## [0.1.4] - 2026-11-18

### Changed
- `release.yml` now grants the job `attestations: write`, so build provenance is
  actually persisted: v0.1.3 shipped without an attestation because the signing step
  was best-effort and its failure was swallowed. The attestation id is now asserted,
  and re-running the workflow for a tag that already has a release downloads the
  published asset and attests those bytes instead of failing or attesting a rebuild.
- `docs/VERIFYING_A_RELEASE.md` gained the GitHub Release section (asset digests, `gh attestation
  verify`, what a passing statement must contain) and `docs/SECURITY_MODEL.md` no longer claims
  there is no SBOM: both were written while the release workflow was still untested against a
  real tag, and are now backed by the shipped `v0.1.3` assets.
- The release now uploads its own proof next to the tarball: the Sigstore bundle as
  `<tarball>.tgz.sigstore.json` and the in-toto statement inside it as
  `<tarball>.tgz.intoto.jsonl`. OpenSSF's `Signed-Releases` probes read the asset names on
  the release, not the record in GitHub's attestation storage, which is why `v0.1.3` scored
  0 with a valid attestation and the pair moved it to 10.

## [0.1.3] - 2026-11-18

### Changed
- Workflow tokens are read-only by default; only the job that pushes `gh-pages`
  or creates a release asks for write on the repository contents.
- `release.yml` can be dispatched against an existing tag, so older versions can
  get a GitHub Release with a signed artifact attached.
- The release workflow builds on Node 24, whose bundled npm already satisfies the
  OIDC trusted-publishing minimum, instead of installing npm during the job.
- The release artifact is attested with `actions/attest-build-provenance`.
- `scorecard.yml` reads branch protection rules when a `SCORECARD_REPO_TOKEN`
  secret is present.
- The npm package now ships `CHANGELOG.md`, so an installed version carries its
  own release log, and each GitHub Release attaches a CycloneDX SBOM of the
  runtime dependency graph alongside the tarball.

### Added
- English API reference for the whole public surface (`docs/COMPONENTS.md`): props tables for all 28 components, the theming API and the `tokens.css` design tokens, covering the OpenSSF `documentation_interface` criterion; linked from the README and the docs site.
- Security model and release verification guides (`docs/SECURITY_MODEL.md`, `docs/VERIFYING_A_RELEASE.md`): actors and actions, attack surface with the source evidence behind each claim, and how to check the registry signature, integrity hash and provenance attestation of an installed version.
- Vitest suite for the component kit and `ThemeProvider` (34 tests), including a property-based test for `Progress` (fast-check) that guards the clamp, the fill and the ARIA values for arbitrary inputs.
- CI on pull requests: test, audit, docs build, package build and a payload check.
- CodeQL scanning for the source and the workflow files.
- OpenSSF Scorecard run that publishes its results, so supply-chain dashboards have data.
- GitHub Release created from each version tag, with the npm tarball and a CycloneDX SBOM attached.
- `SECURITY.md`, `CODEOWNERS`, issue and pull request templates, code of conduct.
- GitHub Actions pinned to commit SHAs instead of moving tags.
- Documented policies in `SECURITY.md` (secrets and credentials, dependency and licence thresholds, SAST findings) and in `CONTRIBUTING.md` (testing environment and permission escalation) — all describing controls that already run, for the OpenSSF OSPS baseline.
- `npm run audit:deps` gates every locked dependency, development included, against OSV.dev, and CI runs it with `--self-test` so a dead detector or a blocked network cannot report a pass.

### Fixed
- Solid badges now take their label colour from the tone's ink token, so `cp-badge--solid` passes AA contrast on every skin (was 1.74:1 on the default accent).
- `Panel` titles are `h2` instead of `h3`, so a panel placed after the page `h1` no longer skips a heading level.
- The docs site declares an SVG favicon, so browsers stop requesting a missing `/favicon.ico` and logging a console error.

### Security
- GitHub withdrew GHSA-fc5q-39xc-vjpf (the dev-only `picomatch` ReDoS reached through
  `vite`), so the exception recorded in `osv-scanner.toml` was removed: the file now
  lists no exceptions and both `npm audit` and `npm run audit:deps` report the whole
  dependency tree clean.

## [0.1.2] - 2026-11-17

### Changed
- Published package no longer carries a source map: tarball 33.2 kB → 20.1 kB, unpacked 150.9 kB → 86.3 kB.
- `files` now allow-lists the library output, so docs-site chunks can never be packed by accident.
- Docs site loads the four non-landing routes as lazy chunks; landing JS 86.6 kB → 76.1 kB gzipped.

### Security
- Publish workflow gates on `npm audit --omit=dev --audit-level=high`.

## [0.1.1] - 2026-11-17

### Changed
- npm releases authenticate with OIDC trusted publishing instead of a stored token.
- README reduced to essentials; the guide page keeps the how-to.

### Added
- Install command in the hero of the docs site.

## [0.1.0] - 2026-11-17

### Added
- First npm publish: ESM bundle, `night-city-ui/style.css` and type declarations.
- 28 components and four skins (Scrap//Tech, Tacky//Futurism, Corpo//Brutalism, Hyper//Opulence) driven by CSS custom properties.
- Docs site with component workbench, playground, theme comparison and colour lab, deployed to GitHub Pages.
- README badges for license, CI status, npm version, React and TypeScript support.

[unreleased]: https://github.com/dan-netrunner/night-city-ui/compare/v0.1.4...HEAD
[0.1.4]: https://github.com/dan-netrunner/night-city-ui/releases/tag/v0.1.4
[0.1.3]: https://github.com/dan-netrunner/night-city-ui/releases/tag/v0.1.3
[0.1.2]: https://github.com/dan-netrunner/night-city-ui/tree/v0.1.2
[0.1.1]: https://github.com/dan-netrunner/night-city-ui/tree/v0.1.1
[0.1.0]: https://github.com/dan-netrunner/night-city-ui/tree/df2696c34005d2a783f5820a230fe7f7a78561f6
