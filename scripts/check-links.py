#!/usr/bin/env python3
"""Comprova enllaços interns, ancores, telèfons i (opcionalment) enllaços externs.

Ús: python3 scripts/check-links.py [--external]
Surt amb codi 1 si hi ha errors interns o telèfons no verificats.
Els enllaços externs només fallen amb 404/410 o error de DNS (avisos en la resta).
"""
import os
import re
import sys
import urllib.error
import urllib.request
from html.parser import HTMLParser
from urllib.parse import unquote, urlparse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://francescsolsonatehas.github.io/Psicoleg/"
SITE_PREFIX = "/Psicoleg/"
# Telèfons verificats. Afegeix-hi un número NOMÉS després d'haver-lo comprovat en una font oficial.
PHONES = {"112", "024", "061", "900202010", "116111", "934144848", "600505152"}
SKIP_DIRS = {".git", "node_modules", ".github", "scripts", "build"}


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links, self.ids = [], set()

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if a.get("id"):
            self.ids.add(a["id"])
        if tag == "a" and a.get("href"):
            self.links.append(a["href"])
        if tag in ("link", "script", "img"):
            ref = a.get("href") or a.get("src")
            if ref and not ref.startswith(("http", "data:", "//")):
                self.links.append(ref)


def pages():
    for dp, dn, fn in os.walk(ROOT):
        dn[:] = [d for d in dn if d not in SKIP_DIRS]
        for f in fn:
            if f.endswith(".html"):
                yield os.path.join(dp, f)


def check_external(ext, errors, warns):
    hdr = {"User-Agent": "Mozilla/5.0 (link-checker; +https://github.com/francescsolsonatehas/Psicoleg)"}
    for url, where in sorted(ext.items()):
        code = None
        for method in ("HEAD", "GET"):
            try:
                r = urllib.request.urlopen(urllib.request.Request(url, headers=hdr, method=method), timeout=20)
                code = r.status
                break
            except urllib.error.HTTPError as e:
                code = e.code
                if method == "HEAD" and code in (400, 403, 405, 501):
                    continue
                break
            except Exception as e:  # DNS, timeout...
                code = str(e)
                if method == "HEAD":
                    continue
                break
        if isinstance(code, int) and code < 400:
            continue
        if code in (404, 410):
            errors.append(f"enllaç extern trencat ({code}): {url}  [{where[0]}]")
        elif isinstance(code, str) and ("Name or service" in code or "nodename" in code):
            errors.append(f"enllaç extern sense DNS: {url}  [{where[0]}]")
        else:
            warns.append(f"avís extern ({code}): {url}")


def main():
    external = "--external" in sys.argv
    parsed, errors, warns, ext = {}, [], [], {}
    for path in pages():
        p = Page()
        p.feed(open(path, encoding="utf-8").read())
        parsed[os.path.relpath(path, ROOT)] = p

    for rel, p in parsed.items():
        base = os.path.dirname(rel)
        for href in p.links:
            if href.startswith("tel:"):
                num = re.sub(r"[^0-9]", "", href[4:])
                if num not in PHONES:
                    errors.append(f"{rel}: telèfon no verificat {href}")
                continue
            if href.startswith(("mailto:", "javascript:")):
                continue
            use_base = base
            if re.match(r"https?://", href):
                if href.startswith(SITE):
                    href = href[len(SITE):]
                    use_base = ""
                else:
                    ext.setdefault(href, []).append(rel)
                    continue
            u = urlparse(href)
            target = unquote(u.path)
            if target.startswith(SITE_PREFIX):
                tpath = target[len(SITE_PREFIX):]
            elif target.startswith("/"):
                tpath = target[1:]
            elif target == "":
                tpath = rel
            else:
                tpath = os.path.normpath(os.path.join(use_base, target))
            full = os.path.join(ROOT, tpath)
            if os.path.isdir(full):
                tpath = os.path.join(tpath, "index.html")
                full = os.path.join(ROOT, tpath)
            if not os.path.exists(full):
                errors.append(f"{rel}: enllaç trencat → {href}")
                continue
            if u.fragment and tpath.endswith(".html"):
                tp = parsed.get(tpath)
                if tp is not None and u.fragment not in tp.ids:
                    errors.append(f"{rel}: ancora inexistent #{u.fragment} a {tpath}")

    if external:
        check_external(ext, errors, warns)
    for w in warns:
        print("AVÍS:", w)
    for er in errors:
        print("ERROR:", er)
    n = sum(len(p.links) for p in parsed.values())
    print(f"{len(parsed)} pàgines, {n} enllaços, {len(ext)} d'externs, {len(errors)} errors, {len(warns)} avisos")
    sys.exit(1 if errors else 0)


if __name__ == "__main__":
    main()
