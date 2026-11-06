# -*- coding: utf-8 -*-
"""Índex del cercador: un js/search/<llengua>.js per idioma, construït a partir de les pàgines ja traduïdes.

Cada entrada: u (ruta relativa a l'arrel de l'idioma), t (títol), h (encapçalaments), x (text), k (tipus: p/f/e).
"""
import html as htmllib
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SKIP = {"index.html", "cerca.html", "404.html"}
TOOL_PAGES = {"eines.html", "eines-tcc.html", "ansietat-social-eines.html", "meves-dades.html"}  # pàgines amb eines amb ancora pròpia
MAXTEXT = 8000


def clean(s):
    s = re.sub(r"<[^>]+>", " ", s)
    s = htmllib.unescape(s)
    return re.sub(r"\s+", " ", s).strip()


def title_of(s):
    """Treu emojis, símbols i numeració («2. ») del davant del títol."""
    return re.sub(r"^\d+\.\s*", "", re.sub(r"^[^\w]+", "", clean(s)))


def entries(page, h):
    m = re.search(r'<main id="main">(.*?)</main>', h, re.S)
    if not m:
        return []
    main = re.sub(r"<(script|style|svg|noscript)\b.*?</\1>", " ", m.group(1), flags=re.S)
    h1 = re.search(r"<h1[^>]*>(.*?)</h1>", main, re.S)
    if not h1:
        return []
    heads = [clean(x) for x in re.findall(r"<h[23][^>]*>(.*?)</h[23]>", main, re.S)]
    kind = "f" if page.startswith("trastorns/") else "p"
    out = [dict(u=page, t=title_of(h1.group(1)), h=" · ".join(x for x in heads if x), x=clean(main)[:MAXTEXT], k=kind)]
    for tid, t2, rest in [] if page not in TOOL_PAGES else re.findall(r'<div class="tool" id="([\w-]+)">\s*<h2[^>]*>(.*?)</h2>(.*?)(?=<div class="tool"|$)', main, re.S):
        p = re.search(r"<p[^>]*>(.*?)</p>", rest, re.S)
        out.append(dict(u=page + "#" + tid, t=title_of(t2), h="", x=clean(p.group(1)) if p else "", k="e"))
    return out


def build(pages, urls, langs):
    os.makedirs(os.path.join(ROOT, "js", "search"), exist_ok=True)
    sizes = {}
    for lang in langs:
        data = []
        for u in urls:
            if u in SKIP:
                continue
            data += entries(u, pages[(lang, u)])
        js = "/* Generat per build/searchindex.py. No editar a mà. */\nwindow.PSI_INDEX=" + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n"
        with open(os.path.join(ROOT, "js", "search", lang + ".js"), "w", encoding="utf-8") as f:
            f.write(js)
        sizes[lang] = (len(data), len(js.encode("utf-8")))
    return sizes
