# Changelog

All notable changes to this project are documented here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project uses
[semantic versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
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
