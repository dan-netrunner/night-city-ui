#!/usr/bin/env node
// Require a Developer Certificate of Origin sign-off on every commit of a pull request.
//
// Why a script and not the DCO GitHub App: the app is a third-party OAuth installation with
// repository-wide read access, and this project's policy (SECURITY.md, docs/SECURITY_MODEL.md)
// is to add no service that can read or write the repository. Twenty lines over `git log` do the
// same job and are auditable in place.
//
// What is enforced, exactly:
//   - each commit needs a `Signed-off-by: Name <email>` trailer whose identity matches the
//     commit author, which is the assertion the DCO text makes (you may submit that work, and you
//     accept its license);
//   - a bot author is exempt: `dependabot[bot]` and friends cannot run `git commit -s`, and
//     pretending otherwise would mean exempting them silently. Exemptions are always printed.
//
// --self-test runs the checker against fixtures, including the cases that MUST fail, so a parser
// that stops seeing violations exits non-zero instead of reporting every pull request as clean.
// Same guarantee scripts/audit-deps.mjs gives for the advisory gate.
import { execFileSync } from "node:child_process";

const FIELD = "\u001f"; // between author name, email and body
const RECORD = "\u001e"; // between commits
const ALL_SIGN_OFFS = /^signed-off-by:\s*(.+?)\s*<([^<>\s]+@[^<>\s]+)>$/gim;

function parseCommits(raw) {
  return raw
    .split(RECORD)
    .map((chunk) => chunk.replace(/^\n/, ""))
    .filter((chunk) => chunk.trim().length > 0)
    .map((chunk) => {
      const [name, email, message] = chunk.split(FIELD);
      return { name, email, message: message ?? "" };
    });
}

// Pure decision: no git, no process, so the self-test can drive it directly.
function verdict(commit) {
  const trailers = [...commit.message.matchAll(ALL_SIGN_OFFS)].map((m) => ({
    name: m[1].trim(),
    email: m[2].trim().toLowerCase(),
  }));
  if (/\[bot\]$/i.test(commit.name ?? "")) {
    return { status: "exempt", reason: "bot author, cannot sign off" };
  }
  if (trailers.length === 0) {
    return { status: "violation", reason: "no Signed-off-by trailer" };
  }
  const matches = trailers.some(
    (t) =>
      t.email === (commit.email ?? "").toLowerCase() &&
      t.name.toLowerCase() === (commit.name ?? "").toLowerCase(),
  );
  return matches
    ? { status: "ok", reason: `${trailers.length} sign-off${trailers.length > 1 ? "s" : ""}` }
    : {
        status: "violation",
        reason: `sign-off identity does not match the author (${trailers
          .map((t) => t.email)
          .join(", ")} != ${commit.email})`,
      };
}

const FIXTURES = [
  {
    label: "signed, identity matches",
    commit: { name: "Ada", email: "ada@example.com", message: "feat: thing\n\nSigned-off-by: Ada <ada@example.com>" },
    expect: "ok",
  },
  {
    label: "no trailer at all",
    commit: { name: "Ada", email: "ada@example.com", message: "feat: thing" },
    expect: "violation",
  },
  {
    label: "trailer signed by somebody else",
    commit: { name: "Ada", email: "ada@example.com", message: "Signed-off-by: Grace <grace@example.com>" },
    expect: "violation",
  },
  {
    label: "bot without a trailer",
    commit: { name: "dependabot[bot]", email: "49699333+dependabot[bot]@users.noreply.github.com", message: "Bump vite" },
    expect: "exempt",
  },
  {
    label: "several trailers, one matches",
    commit: {
      name: "Ada",
      email: "ada@example.com",
      message: "Signed-off-by: Grace <grace@example.com>\nSigned-off-by: ada <ADA@example.com>",
    },
    expect: "ok",
  },
  {
    label: "empty message",
    commit: { name: "Ada", email: "ada@example.com", message: "" },
    expect: "violation",
  },
  {
    label: "malformed trailer, no angle brackets",
    commit: { name: "Ada", email: "ada@example.com", message: "Signed-off-by: Ada ada@example.com" },
    expect: "violation",
  },
];

function selfTest() {
  let bad = 0;
  for (const fixture of FIXTURES) {
    const got = verdict(fixture.commit).status;
    const fine = got === fixture.expect;
    if (!fine) bad++;
    console.log(`  ${fine ? "ok  " : "FAIL"} ${fixture.label}: esperado ${fixture.expect}, obtenido ${got}`);
  }
  // A trailer buried in a quoted reply must not count as a sign-off: the parser anchors at the
  // start of a line, so "> Signed-off-by: …" is not a match. Assert it, or a future regex change
  // would quietly accept it.
  const quoted = verdict({
    name: "Ada",
    email: "ada@example.com",
    message: "> Signed-off-by: Ada <ada@example.com>",
  }).status;
  if (quoted !== "violation") {
    bad++;
    console.log(`  FAIL trailer en una cita: esperado violation, obtenido ${quoted}`);
  } else {
    console.log("  ok   trailer en una cita no cuenta");
  }
  if (bad > 0) {
    console.error(`\nself-test fallido (${bad}): el verificador ya no aplica la política que dice aplicar.`);
    return 1;
  }
  console.log(`\nself-test: ${FIXTURES.length + 1} casos, el verificador distingue lo que debe distinguir.`);
  return 0;
}

function main(argv) {
  // The workflow asks for both: prove the checker works, then use it. If the self-test
  // fails there is no point reading the pull request with a parser that is broken.
  if (argv.includes("--self-test") && selfTest() !== 0) return 1;
  if (argv.length === 1 && argv[0] === "--self-test") return 0;
  const fromIndex = argv.indexOf("--from");
  const from = (fromIndex >= 0 ? argv[fromIndex + 1] : process.env.DCO_BASE_SHA) || "";
  if (!from) {
    console.error(
      "falta la base: node scripts/check-dco.mjs --from <base-sha> (o DCO_BASE_SHA), --self-test.",
    );
    console.error("sin base no se puede acotar el rango; salir sin comprobar nada seria un pase falso.");
    return 2;
  }
  // Merge commits are skipped by git itself: a merge carries no new authorship to attest,
  // and GitHub's own merge ref would otherwise fail every pull request.
  const logArgs = ["log", "--no-merges", `--format=%an${FIELD}%ae${FIELD}%B${RECORD}`, `${from}..HEAD`];
  const range = `${from}..HEAD`;
  let raw;
  try {
    raw = execFileSync("git", logArgs, {
      encoding: "utf8",
      maxBuffer: 32 * 1024 * 1024,
    });
  } catch (error) {
    console.error(`no se pudo leer el historial ${range}: ${error.message.split("\n")[0]}`);
    console.error("el job necesita actions/checkout con fetch-depth: 0.");
    return 2;
  }
  const commits = parseCommits(raw);
  if (commits.length === 0) {
    console.log(`sin commits en ${range}: nada que firmar.`);
    return 0;
  }
  const counts = { ok: 0, violation: 0, exempt: 0 };
  const problems = [];
  for (const commit of commits) {
    const result = verdict(commit);
    counts[result.status]++;
    if (result.status !== "ok") {
      const label = `${commit.name} <${commit.email}> ${commit.message.split("\n")[0].slice(0, 58)}`;
      console.log(`  ${result.status === "exempt" ? "exento   " : "sin DCO  "} ${label} — ${result.reason}`);
      if (result.status === "violation") problems.push(label);
    }
  }
  console.log(
    `\n${commits.length} commits: ${counts.ok} con DCO, ${counts.exempt} exentos, ${counts.violation} sin firmar.`
  );
  if (problems.length > 0) {
    console.error(
      `\nFalta la afirmación DCO en ${problems.length} commit(s). Añádela con:\n` +
        "  git commit --amend -s            # el último\n" +
        "  git rebase --signoff <base>      # todos los de la rama\n" +
        "y vuelve a push. La política está en CONTRIBUTING.md."
    );
    return 1;
  }
  return 0;
}

// A CLI, not a library: no import guard, because a guard that stops matching would make the
// check exit 0 without looking at a single commit - the exact silent pass this file exists
// to prevent.
process.exit(main(process.argv.slice(2)));
