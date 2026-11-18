#!/usr/bin/env python3
"""Push .bestpractices.json into the OpenSSF Best Practices badge entry.

The badge site reads .bestpractices.json to *propose* answers, which still needs
a human to click through each section. This script performs the same writes
through the documented REST interface instead, reusing the badge project's own
modifier module (pinned by commit and checksum rather than tracked here, so an
upstream change is a deliberate edit to the two constants below).

Authentication is the badge session cookie, valid 48 hours:
  1. Log into https://www.bestpractices.dev in a browser.
  2. DevTools -> Application -> Cookies -> copy the value of _BadgeApp_session.
  3. export _BadgeApp_session='<value>'    # never put it in a file or in CI

Usage:
  ./scripts/bestpractices-sync.py --dry-run     # show the plan, no network
  ./scripts/bestpractices-sync.py               # require the cookie and write
  ./scripts/bestpractices-sync.py --only crypto # subset by key substring

The script never prints the cookie.
"""

import argparse
import hashlib
import importlib.util
import json
import os
import sys
import urllib.request

PROJECT_ID = "16895"
REPOSITORY = "dan-netrunner/night-city-ui"
MODULE_COMMIT = "31325acd7963e0c9203da0ff798802a766237517"
MODULE_SHA256 = "052be76516a79ffcc30e89c2b41d0208049460fd1599af3973a033d3433bdb6d"
MODULE_URL = (
    "https://raw.githubusercontent.com/ossf/best-practices-badge/"
    f"{MODULE_COMMIT}/docs/best_practices_modify.py"
)
BATCH = 20

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAYLOAD = os.path.join(ROOT, ".bestpractices.json")
CACHE = os.path.join(ROOT, ".cache", "best_practices_modify.py")


def load_payload(only):
    with open(PAYLOAD, encoding="utf-8") as handle:
        data = json.load(handle)
    keys = sorted(data)
    if only:
        keys = [k for k in keys if only in k.lower()]
        data = {k: data[k] for k in keys}
    if not keys:
        sys.exit("nothing selected")
    return data


def batches(data):
    keys = sorted(data)
    for start in range(0, len(keys), BATCH):
        yield {k: data[k] for k in keys[start:start + BATCH]}


def fetch_module():
    if os.path.exists(CACHE):
        with open(CACHE, "rb") as handle:
            cached = handle.read()
        if hashlib.sha256(cached).hexdigest() == MODULE_SHA256:
            return cached
    with urllib.request.urlopen(MODULE_URL, timeout=60) as response:
        body = response.read()
    digest = hashlib.sha256(body).hexdigest()
    if digest != MODULE_SHA256:
        sys.exit(
            f"checksum mismatch for {MODULE_URL}\n"
            f"  expected {MODULE_SHA256}\n  got      {digest}\n"
            f"Review the upstream change, then update MODULE_COMMIT and MODULE_SHA256."
        )
    os.makedirs(os.path.dirname(CACHE), exist_ok=True)
    with open(CACHE, "wb") as handle:
        handle.write(body)
    return body


def import_module(body):
    spec = importlib.util.spec_from_loader("bpmod", loader=None)
    mod = importlib.util.module_from_spec(spec)
    exec(compile(body.decode("utf-8"), MODULE_URL, "exec"), mod.__dict__)
    return mod


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--dry-run", action="store_true", help="print the plan and exit")
    parser.add_argument("--only", metavar="SUBSTR", help="only keys containing SUBSTR")
    args = parser.parse_args()

    data = load_payload(args.only)
    statuses = {k: v for k, v in data.items() if k.endswith("_status")}
    plan = list(batches(data))
    print(f"{REPOSITORY} -> project {PROJECT_ID}: {len(data)} keys in {len(plan)} batches")
    for key in sorted(statuses):
        print(f"  {statuses[key]:<6} {key[:-7]}")

    if args.dry_run:
        print("\ndry run: no se ha contactado con bestpractices.dev")
        return 0

    cookie = os.environ.get("_BadgeApp_session")
    if not cookie:
        sys.exit(
            "export _BadgeApp_session='<valor de la cookie>' first "
            "(sesión de https://www.bestpractices.dev, caduca a las 48 h)"
        )

    mod = import_module(fetch_module())
    for index, batch in enumerate(plan, start=1):
        ok = mod.write_to_project(mod.PRODUCTION_BASE_URL, PROJECT_ID, batch, cookie)
        print(f"batch {index}/{len(plan)}: {'ok' if ok else 'FALLO'} ({len(batch)} claves)")
        if not ok:
            return 1
    print("listo; comprueba https://www.bestpractices.dev/projects/%s.json" % PROJECT_ID)
    return 0


if __name__ == "__main__":
    sys.exit(main())
