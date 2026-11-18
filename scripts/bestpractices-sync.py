#!/usr/bin/env python3
"""Push .bestpractices.json into the OpenSSF Best Practices badge entry.

Why this exists: the badge site reads .bestpractices.json only to *propose*
answers (RepoJsonDetective, confidence 3.5), which still needs a human to click
through every section. This script writes them through the same endpoints the
site's own forms use, then verifies the result against the public JSON.

Note on the upstream helper: docs/best_practices_modify.py in the badge
repository is broken against the current app. It fetches /en/projects/<id>/edit
and PATCHes /en/projects/<id>; as of commit 31325ac the routes are

    GET    /:locale/projects/:id/choose/edit       projects#choose_edit
    GET    /:locale/projects/:id/:section/edit     projects#edit
    PATCH  /:locale/projects/:id/:section/edit     projects#update

and the old URLs answer 404 (verified with curl on 2026-11-18, which is why
that module raised HTTP 404 in get_project_tokens). Here the sections come from
the choose page and every write goes to its own /edit URL.

Key names are the database columns, which is what the form posts:
"osps_ac_01_01_status", not the display form "OSPS-AC-01.01_status" that the
public JSON uses. There are no "<criterion>_url" columns: a criterion with
met_url_required is satisfied by a URL inside its *_justification text
(Project#contains_url?), so the file keeps the URL in the justification.

Authentication is the badge session cookie, valid 48 hours. Run the script and
paste the value when asked; it is read with getpass, so it does not land in
shell history, and it is never printed:
  1. Log into https://www.bestpractices.dev in a browser.
  2. DevTools -> Application -> Cookies -> copy the value of _BadgeApp_session.
  3. Log out of the site when done, to invalidate it.

Usage:
  ./scripts/bestpractices-sync.py --dry-run        # plan only, no cookie, no write
  ./scripts/bestpractices-sync.py --verify-only    # site vs file, read-only
  ./scripts/bestpractices-sync.py --sections       # list sections, write nothing
  ./scripts/bestpractices-sync.py                  # write, then verify
  ./scripts/bestpractices-sync.py --only osps_qa   # subset by key substring

A save can be rejected by model validation while still returning HTTP 200 (the
app re-renders the form), so success is decided by re-reading the public JSON,
not by the status code.
"""

import argparse
import getpass
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

PROJECT_ID = "16895"
REPOSITORY = "dan-netrunner/night-city-ui"
BASE_URL = "https://www.bestpractices.dev/"
COOKIE_NAME = "_BadgeApp_session"
BATCH_KEYS = 20
USER_AGENT = "bestpractices-sync/1.0 ({}; owner-operated)".format(REPOSITORY)

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAYLOAD = os.path.join(ROOT, ".bestpractices.json")

AUTH_TOKEN_RE = re.compile(r'<input[^>]*name="authenticity_token"[^>]*value="([^"]+)"')
FIELD_RE = re.compile(r'name="project\[([A-Za-z0-9_.]+)\]"')
SECTION_RE = re.compile(r'/projects/{}/([a-z0-9][a-z0-9_-]*)/edit'.format(PROJECT_ID))
# The app's own failure banner, from app/views/shared/_error_messages.html.erb.
ERROR_RE = re.compile(r'prohibited this project from being saved|error_explanation', re.I)

# Display form used by the public JSON -> column name used by the form.
DISPLAY_TO_COLUMN = re.compile(r'^OSPS-([A-Z]{2})-(\d{2})\.(\d{2})(.*)$')


def column_name(key):
    match = DISPLAY_TO_COLUMN.match(key)
    if not match:
        return key
    group, first, second, rest = match.groups()
    return "osps_{}_{}_{}{}".format(group.lower(), first, second, rest)


class Site:
    """Cookie-aware client for the badge app. Never logs the credential."""

    def __init__(self, cookie=None):
        self.cookie = cookie
        self.token = None
        self.csrf = None

    def request(self, path, data=None, method=None):
        request = urllib.request.Request(BASE_URL + path, method=method)
        request.add_header("User-Agent", USER_AGENT)
        if self.cookie:
            request.add_header("Cookie", "{}={}".format(COOKIE_NAME, self.cookie))
        if self.csrf:
            request.add_header("X-CSRF-Token", self.csrf)
        body = None
        if data is not None:
            request.add_header("Content-Type", "application/x-www-form-urlencoded")
            body = urllib.parse.urlencode(data).encode("utf-8")
        try:
            with urllib.request.urlopen(request, body, timeout=120) as response:
                self._renew(response.headers.get("Set-Cookie"))
                return response.getcode(), response.read().decode("utf-8", "replace")
        except urllib.error.HTTPError as error:
            self._renew(error.headers.get("Set-Cookie"))
            return error.code, error.read().decode("utf-8", "replace")
        except urllib.error.URLError as error:
            sys.exit("no se puede acceder a {}{}: {}".format(BASE_URL, path, error.reason))

    def _renew(self, set_cookie):
        prefix = COOKIE_NAME + "="
        if set_cookie and set_cookie.startswith(prefix):
            self.cookie = set_cookie[len(prefix):].split(";")[0]

    def choose_edit(self):
        code, html = self.request("en/projects/{}/choose/edit".format(PROJECT_ID))
        if code != 200:
            sys.exit("choose/edit -> HTTP {}: ¿cookie caducada o sin permiso sobre "
                     "el proyecto?".format(code))
        token = AUTH_TOKEN_RE.search(html)
        if token:
            self.token = token.group(1)
        # /choose/edit has no criteria form, so it is not a writable section even
        # though it matches the .../edit URL shape.
        return [s for s in dict.fromkeys(SECTION_RE.findall(html)) if s != "choose"]

    def edit_form(self, section):
        """GET a section's edit form; returns (authenticity_token, field names)."""
        path = "en/projects/{}/{}/edit".format(PROJECT_ID, section)
        code, html = self.request(path)
        if code != 200:
            print("  {}: HTTP {}, omitida".format(section, code), file=sys.stderr)
            return None
        token = AUTH_TOKEN_RE.search(html)
        if not token:
            print("  {}: sin authenticity_token (¿sesión no válida?), omitida".format(section),
                  file=sys.stderr)
            return None
        self.token = token.group(1)
        self.csrf = self.token
        return self.token, set(FIELD_RE.findall(html))

    def write(self, section, batch):
        """PATCH one batch of keys to the section's own /edit URL.

        Deliberately sends no `continue` param: that is the "Save (and continue)"
        button, which makes the app apply every non-forced automation proposal
        to blank fields on save. Without it only forced proposals land, so what
        gets written is what the file says. It also sends no `lock_version`, so
        the row's own version is used and the save cannot fail as stale.
        """
        data = {"authenticity_token": self.token}
        data.update({"project[{}]".format(key): value for key, value in batch.items()})
        code, body = self.request("en/projects/{}/{}/edit".format(PROJECT_ID, section),
                                  data=data, method="PATCH")
        if ERROR_RE.search(body):
            print("  {} -> el modelo rechazó el guardado (HTTP {}): {}".format(
                section, code, re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", body))[:200]),
                file=sys.stderr)
            return False
        return code in (200, 204, 302)


def load_payload(only):
    with open(PAYLOAD, encoding="utf-8") as handle:
        data = json.load(handle)
    unknown = sorted(key for key in data if not key.endswith(("_status", "_justification")))
    if unknown:
        print("aviso: {} claves no son *_status ni *_justification y el sitio las "
              "ignora: {}".format(len(unknown), unknown[:5]), file=sys.stderr)
    if only:
        data = {key: value for key, value in data.items() if only in key.lower()}
    if not data:
        sys.exit("nothing selected")
    return data


def groups(payload):
    """Keys grouped by criterion, so a status never leaves its justification behind.

    Shortcut: the app validates the whole row on save, so splitting a Met status
    from its justification across two batches can fail both. Upgrade to a single
    request per section if the API ever exposes one.
    """
    stems = {}
    for key, value in payload.items():
        stem = re.sub(r"_(status|justification)$", "", key)
        stems.setdefault(stem, []).append(key)
    batch, size = [], 0
    for stem in sorted(stems):
        keys = sorted(stems[stem])
        if batch and size + len(keys) > BATCH_KEYS:
            yield batch
            batch, size = [], 0
        for key in keys:
            batch.append((key, payload[key]))
        size += len(keys)
    if batch:
        yield batch


def verify(payload):
    """Compare the public entry with what the file claims. Needs no cookie."""
    request = urllib.request.Request("{}projects/{}.json".format(BASE_URL, PROJECT_ID),
                                     headers={"User-Agent": USER_AGENT})
    try:
        with urllib.request.urlopen(request, timeout=60) as response:
            raw = json.loads(response.read().decode("utf-8"))
    except (urllib.error.URLError, ValueError) as error:
        sys.exit("no se pudo leer el JSON público: {}".format(error))
    live = {column_name(key): value for key, value in raw.items()}
    wanted = {key: value for key, value in payload.items() if key.endswith("_status")}
    missing, differ = [], []
    for key, want in sorted(wanted.items()):
        got = live.get(key)
        if got in (None, "", "?"):
            missing.append((key[:-7], want))
        elif got != want:
            differ.append((key[:-7], got, want))
    print("\nverificado contra {}projects/{}.json".format(BASE_URL, PROJECT_ID))
    print("  estados en el archivo: {} | aplicados: {} | pendientes: {} | distintos: {}"
          .format(len(wanted), len(wanted) - len(missing) - len(differ), len(missing),
                  len(differ)))
    for key, want in missing[:30]:
        print("  pendiente {:<32} -> {}".format(key, want))
    if len(missing) > 30:
        print("  … {} pendientes más".format(len(missing) - 30))
    for key, got, want in differ[:30]:
        print("  distinto  {:<32} sitio={} archivo={}".format(key, got, want))
    print("  badge_level={} percentage_0={} percentage_baseline_1={}"
          .format(raw.get("badge_level"), raw.get("badge_percentage_0"),
                  raw.get("badge_percentage_baseline_1")))
    if missing or differ:
        print("  (el sitio purga su caché al guardar; si acabas de escribir, "
              "repite --verify-only en unos segundos)")
    return not missing and not differ


def main():
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--dry-run", action="store_true", help="print the plan, write nothing")
    parser.add_argument("--verify-only", action="store_true", help="compare site with file")
    parser.add_argument("--sections", action="store_true", help="list the sections and their fields")
    parser.add_argument("--only", metavar="SUBSTR", help="only keys containing SUBSTR")
    args = parser.parse_args()

    payload = load_payload(args.only)

    if args.dry_run:
        statuses = {key: value for key, value in payload.items() if key.endswith("_status")}
        print("{} -> project {}: {} claves, {} estados, {} lotes".format(
            REPOSITORY, PROJECT_ID, len(payload), len(statuses), len(list(groups(payload)))))
        for key in sorted(statuses):
            print("  {:<6} {}".format(statuses[key], key[:-7]))
        print("\ndry run: no se ha contactado con bestpractices.dev")
        return 0

    if args.verify_only:  # read-only: the public JSON needs no credential
        return 0 if verify(payload) else 1

    try:
        cookie = os.environ.get(COOKIE_NAME) or getpass.getpass(
            "valor de la cookie {} (no se muestra ni se guarda): ".format(COOKIE_NAME))
    except (EOFError, KeyboardInterrupt):
        sys.exit("\nsin cookie no hay escritura: ejecútalo en una terminal interactiva "
                 "o exporta la variable")
    site = Site(cookie)

    sections = site.choose_edit()
    if not sections:
        sys.exit("choose/edit no enlaza ninguna sección: la cookie no autoriza la edición "
                 "(el sitio devuelve la página de acceso) o ha cambiado el formato")
    print("secciones: " + ", ".join(sections))
    if args.sections:
        for section in sections:
            form = site.edit_form(section)
            print("  {:<12} {} campos".format(
                section, len(form[1]) if form else "sin acceso"))
        return 0

    covered = set()
    failures = 0
    for section in sections:
        form = site.edit_form(section)
        if not form:
            failures += 1
            continue
        _, fields = form
        mine = {key: value for key, value in payload.items() if key in fields}
        # Pairing keeps a status with its justification: the app validates the
        # whole row on save, and a Met without its justification would be graded
        # criterion_justification_required, i.e. not enough to pass.
        for stem in [key[:-7] for key in list(mine) if key.endswith("_status")]:
            justification = stem + "_justification"
            if justification in payload:
                mine[justification] = payload[justification]
        covered.update(mine)
        if not mine:
            print("  {:<12} 0 claves propias".format(section))
            continue
        ok = True
        for batch in groups(mine):
            ok = site.write(section, dict(batch)) and ok
        print("  {:<12} {} claves en {} lotes -> {}".format(
            section, len(mine), len(list(groups(mine))), "ok" if ok else "FALLO"))
        if not ok:
            failures += 1

    untouched = sorted(set(payload) - covered)
    if untouched:
        print("\n{} claves no aparecen en ningún formulario leído (¿nombre de columna "
              "incorrecto?)".format(len(untouched)))
        for key in untouched[:10]:
            print("  " + key)
        failures += 1

    return 0 if not failures and verify(payload) else 1


if __name__ == "__main__":
    sys.exit(main())
