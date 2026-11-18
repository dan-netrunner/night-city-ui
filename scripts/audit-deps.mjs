#!/usr/bin/env node
// Gate every locked dependency - development included - on OSV.dev advisories.
// `npm audit --omit=dev` keeps protecting what consumers install; this covers
// the toolchain half of the policy written in SECURITY.md.
//
// OSV's /v1/querybatch returns nothing useful, so each package is queried
// individually with a small concurrency pool. --self-test also checks a
// known-vulnerable fixture and fails if the advisory is NOT reported, so a
// schema change or a blocked network can never produce a silent pass.
import { readFileSync } from "node:fs";

const FIXTURE = { name: "minimist", version: "1.2.5" };

let ignoreSource = "osv-scanner.toml";
let ignoreText = "";
try {
  ignoreText = readFileSync(ignoreSource, "utf8");
} catch {
  console.error(`${ignoreSource} is missing: the gate needs it to record exceptions.`);
  process.exit(2);
}
const ignoreIds = new Set(
  [...ignoreText.matchAll(/^\s*id\s*=\s*"([^"]+)"/gim)].map((match) => match[1]),
);
const reportIgnored = process.argv.includes("--no-ignore");
const selfTest = process.argv.includes("--self-test");

async function advisoryIds(name, version) {
  const response = await fetch("https://api.osv.dev/v1/query", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ package: { name, ecosystem: "npm" }, version }),
  });
  if (!response.ok) throw new Error(`OSV query for ${name}@${version}: HTTP ${response.status}`);
  const data = await response.json();
  return (data.vulns ?? []).map((vuln) => [vuln.id, ...(vuln.aliases ?? [])].filter(Boolean));
}

const lock = JSON.parse(readFileSync("package-lock.json", "utf8"));
const packages = new Map();
for (const [path, entry] of Object.entries(lock.packages ?? {})) {
  if (!path.startsWith("node_modules/") || !entry.version) continue;
  const name = path.slice(path.lastIndexOf("node_modules/") + "node_modules/".length);
  if (name) packages.set(`${name}@${entry.version}`, { name, version: entry.version });
}
if (!packages.size) {
  console.error("package-lock.json lists no dependencies - refusing to claim a pass.");
  process.exit(2);
}

const targets = [...packages.values()].map((pkg) => ({ ...pkg, fixture: false }));
if (selfTest) targets.push({ ...FIXTURE, fixture: true });

let cursor = 0;
let blocked = 0;
let ignored = 0;
let fixtureConfirmed = 0;
const failures = [];

async function worker() {
  while (cursor < targets.length) {
    const { name, version, fixture } = targets[cursor++];
    let ids;
    try {
      ids = await advisoryIds(name, version);
    } catch (error) {
      failures.push(error.message);
      continue;
    }
    for (const group of ids) {
      if (fixture) {
        fixtureConfirmed++;
        continue;
      }
      if (!reportIgnored && group.some((id) => ignoreIds.has(id))) {
        ignored++;
        continue;
      }
      blocked++;
      console.error(`::error::${group[0]} affects ${name}@${version}`);
    }
  }
}

await Promise.all(Array.from({ length: 12 }, worker));

console.log(
  `OSV gate: ${packages.size} locked packages, ${blocked} blocking, ${ignored} ignored by osv-scanner.toml` +
    (selfTest ? `, fixture ${FIXTURE.name}@${FIXTURE.version} advisories ${fixtureConfirmed}` : ""),
);

if (failures.length) {
  for (const message of failures.slice(0, 5)) console.error(`::error::${message}`);
  console.error(`OSV was unreachable for ${failures.length} packages - not a pass.`);
  process.exit(2);
}
if (selfTest && fixtureConfirmed === 0) {
  console.error("Self-test failed: the known-vulnerable fixture reported nothing.");
  process.exit(2);
}
if (blocked) {
  console.error("Upgrade the package, or ignore the advisory with a written reason in osv-scanner.toml.");
  process.exit(1);
}
process.exit(0);
