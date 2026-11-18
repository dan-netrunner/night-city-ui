# Verifying a release

Every published `night-city-ui` version can be checked for integrity (the bytes
are what npm served), authenticity (npm served them) and authorship (a
specific GitHub Actions run on this repository built and published them).
Commands below were run against `night-city-ui@0.1.2` and their output is real.

## 1. Registry signature and provenance attestation

From any project that installed the package:

```sh
mkdir verify && cd verify
npm init -y
npm i --prefer-online night-city-ui@0.1.2
npm audit signatures
```

Actual output:

```text
audited 4 packages in 1s

4 packages have verified registry signatures

4 packages have verified attestations
(use --json --include-attestations to view attestation details)
```

What each field proves:

- **registry signature** — the package was signed by npm's registry key, so it
  came from `registry.npmjs.org` and was not modified in transit or at rest on
  the CDN. It does *not* say who published it.
- **provenance attestation** — a signed, transparency-log-recorded (Sigstore)
  statement of *which workflow, on which repository, at which commit* produced
  and published this exact tarball. This is the stronger claim; registry
  signatures cover packages published without provenance too.

Both are present for **every** version of this package, because releases are
published by CI with `npm publish --provenance` via OIDC trusted publishing
(see `.github/workflows/publish-npm.yml`).

The attestation details are fetched at request time from a transient signed
URL (`https://registry.npmjs.org/.../attestations?...`); the query part
rotates per request, so don't pin or compare that URL — compare the verified
contents instead (`npm audit signatures --json --include-attestations`).

## 2. Integrity hash (sha512)

The registry records the SHA-512 of the exact tarball it serves:

```sh
npm view night-city-ui@0.1.2 dist.integrity
```

```text
sha512-YUE1HNoF0XqqFvSH2ROB91z7FVKJbIwUfdgxSG3/8rnmOl1FLAfIZvYMrmnoVrBXon2Hwt1h0VKhwmRFS/D08g==
```

Compare it with a downloaded tarball:

```sh
npm pack night-city-ui@0.1.2   # downloads the registry tarball unmodified
sha512sum night-city-ui-0.1.2.tgz
```

```text
6141351cda05d17aaa16f487d91381f75cfb1552896c8c147dd831486dfff2b9e63a5d452c07c866f60cae69e856b057a27d87c2dd61d152a1c264454bf0f4f2
```

`dist.integrity` is the same digest in base64: decode it to hex
(`echo YUE1… | base64 -d | xxd -p`) or re-encode your `sha512sum` output to
base64 and compare. For 0.1.2 both forms match (verified as part of writing
this guide).

**Expected transformation:** npm builds the tarball itself during
`npm publish`. A tarball you rebuild locally with `npm pack` from a clone will
*not* match byte-for-byte (npm embeds its own packing metadata), and that is
not a tamper signal. The registry integrity value is the authority; the
provenance statement (§3) is what ties that tarball back to this repository's
source.

## 3. The provenance statement: artifact → repository → commit

`npm audit signatures --json --include-attestations` contains the SLSA v1
provenance for `night-city-ui@0.1.2`. The material parts, as published:

```json
{
  "subject": [{
    "name": "pkg:npm/night-city-ui@0.1.2",
    "digest": { "sha512": "6141351cda05d17aaa16f487d91381f75cfb1552896c8c147dd831486dfff2b9e63a5d452c07c866f60cae69e856b057a27d87c2dd61d152a1c264454bf0f4f2" }
  }],
  "predicate": {
    "buildDefinition": {
      "buildType": "https://slsa-framework.github.io/github-actions-buildtypes/workflow/v1",
      "externalParameters": {
        "workflow": {
          "ref": "refs/heads/main",
          "repository": "https://github.com/dan-netrunner/night-city-ui",
          "path": ".github/workflows/publish-npm.yml"
        }
      },
      "resolvedDependencies": [{
        "uri": "git+https://github.com/dan-netrunner/night-city-ui@refs/heads/main",
        "digest": { "gitCommit": "35ccf0dbd41d652ab4aad2df9edb945b1d08aa6e" }
      }]
    },
    "runDetails": {
      "builder": { "id": "https://github.com/actions/runner/github-hosted" },
      "invocationId": "https://github.com/dan-netrunner/night-city-ui/actions/runs/44162578609/attempts/1"
    }
  }
}
```

Note the `digest` — it is the same sha512 as `dist.integrity` in §2, so the
statement binds *this exact tarball* to *this exact commit and workflow*.

Check the referenced run:

```sh
gh run view 44162578609 --repo dan-netrunner/night-city-ui
```

One honest caveat, visible in that run: its overall conclusion is `failure`
only because the final step, "Verify the version reached the registry" (a
propagation poll), timed out after the publish had already succeeded — the
"Build and publish" step is green and the package is live. When auditing a
release, check the `Build and publish` step's result, not just the run's
aggregate status.

## 4. Who published it

No human's npm password was involved. The identity chain is:

1. The npm package `night-city-ui` is configured for **trusted publishing**:
   the only publisher allowed is the GitHub Actions workflow
   `publish-npm.yml` from `dan-netrunner/night-city-ui`, environment `npm`.
2. On a push to `main`, that job requests a short-lived **GitHub OIDC token**
   (`id-token: write`) and npm exchanges it for a publish credential. There is
   no long-lived npm token stored in repository secrets.
3. The resulting provenance statement (§3) records the repository, workflow
   path, git ref and commit, signed by GitHub's Sigstore CA and logged in
   Rekor — verifiable without trusting this README.

So "who" = *this workflow, on `main`, at that commit* — auditable via
`dist.attestations.url` and the Actions run.

## 5. The GitHub Release assets

From `v0.1.3` on, each version tag produces a GitHub Release carrying four assets:
the tarball, a CycloneDX SBOM, the Sigstore bundle and the in-toto statement
extracted from it.

```sh
gh release view v0.1.3 --repo dan-netrunner/night-city-ui \
  --json assets --jq '.assets[] | "\(.name) \(.size) \(.digest)"'
```

The two proof files exist so the verification does not depend on GitHub's
attestation storage being reachable or on a release↔attestation link: Scorecard's
own probes only look at these names — `.sigstore` / `.sigstore.json` / `.asc` /
`.sig` / `.sign` / `.minisig` count as a signature, `.intoto.jsonl` counts as
provenance (`probes/releasesAreSigned`, `probes/releasesHaveProvenance`). Before
they were attached, `v0.1.3` scored `Signed-Releases = 0` while its attestation
was verifiable by digest.

Verify the tarball itself, not the files about it:

```sh
gh release download v0.1.3 -p '*.tgz' -D ./dl
gh attestation verify ./dl/night-city-ui-0.1.3.tgz --repo dan-netrunner/night-city-ui
```

What a passing result must say, and this is the part worth reading:

- `subject … name: night-city-ui-0.1.3.tgz, digest sha256:d9052b54…baac` — the
  subject digest equals the asset's `sha256:` digest from the command above, so
  the statement is about the bytes you downloaded;
- `buildType: …/workflow/v1` with `path: .github/workflows/release.yml`,
  `ref: refs/heads/main`;
- `builder.id` and `buildSignerURI` on `github.com/dan-netrunner/night-city-ui`;
- `sourceRepositoryDigest` pinned to a commit, and `runInvocationURI` pointing at
  the exact Actions run and attempt.

The tarball is reproducible: rebuilding `npm run build:lib && npm pack` from the
tag gives the same `sha256`, so a mismatch means the asset was replaced, not that
the build drifted.

One nuance about `v0.1.3`: its release was created by the tag push and the
attestation was added by a later run of the same workflow, after the signing
permission was fixed. GitHub therefore resolves the record **by artifact digest**
(`GET /repos/…/attestations/sha256:…` answers, and `gh attestation verify` uses
that), while the release entry itself has no attestation link
(`GET /repos/…/releases/{id}/attestations` does not). The digest binding is what
carries the guarantee; check both if you want the release page to show it too.

### What this caught once, and how to spot it yourself

`v0.1.3` first appeared on the releases page **unsigned**: the signing step lacked
the `attestations: write` permission and was marked best-effort, so the run went
green while the attestation call failed with `Resource not accessible by
integration`. Two lessons for anyone auditing a release:

1. An attestation is only evidence if you query it — `gh attestation verify`
   returning `HTTP 404` on the asset digest means *absent*, not *broken*.
2. A green release run is not proof of a signed artifact. `release.yml` now grants
   the scope, dropped `continue-on-error` on signing, fails the run unless the
   action reports an `attestation-id`, and uploads the bundle and the statement as
   release assets so the proof is downloadable instead of only queryable.

## 6. If verification fails

If signatures or attestations are missing or invalid, or the integrity hash
does not match what the registry reports: do not use the package, and report
it privately — see [SECURITY.md](../SECURITY.md).
