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
- Dev-tooling advisories are tracked in the CI workflow comments. One is
  currently open upstream and unpatchable: a ReDoS in `picomatch`
  ([GHSA-fc5q-39xc-vjpf](https://github.com/advisories/GHSA-fc5q-39xc-vjpf))
  reached through `vite`. It is build-time only, its glob patterns are
  repo-authored, and it cannot reach a published consumer.
- Dependency lifecycle scripts are blocked unless allow-listed in
  `package.json` → `allowScripts`.
- Every release is published from GitHub Actions with npm provenance
  (OIDC trusted publishing, no long-lived token in the repo).
