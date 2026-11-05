# -*- coding: utf-8 -*-
"""Diccionaris del JavaScript: les claus són les cadenes en català dels js/*.js; les traduccions, a build/i18n/js.<lang>.tsv."""
import glob
import json
import os
import re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
PAT = re.compile(r"(?:__|_f|PSI\.t|PSI\.f)\(\s*(?:[^'()]*\?)?\s*'((?:[^'\\\n]|\\.)*)'(?:\s*:\s*'((?:[^'\\\n]|\\.)*)')?")


def unesc(s):
    return re.sub(r"\\(.)", lambda m: {"n": "\n", "t": "\t"}.get(m.group(1), m.group(1)), s)


def esc(s):
    return s.replace("\\", "\\\\").replace("\n", "\\n").replace("\t", "\\t")


def unesc_tsv(s):
    return re.sub(r"\\(.)", lambda m: {"n": "\n", "t": "\t"}.get(m.group(1), m.group(1)), s)


def keys():
    out = []
    for p in sorted(glob.glob(os.path.join(ROOT, "js", "*.js"))):
        if os.path.basename(p) in ("i18n.js", "main.js", "lectura.js", "assistent.js"):
            continue
        src = open(p, encoding="utf-8").read()
        for m in PAT.finditer(src):
            for g in m.groups():
                if g is not None:
                    k = unesc(g)
                    if k not in out:
                        out.append(k)
    # claus de l'assistent (PSI.t / PSI.f amb text literal)
    src = open(os.path.join(ROOT, "js", "assistent.js"), encoding="utf-8").read()
    for m in re.finditer(r"PSI\.[tf]\(\s*'((?:[^'\\\n]|\\.)*)'", src):
        k = unesc(m.group(1))
        if k not in out:
            out.append(k)
    return out


def load(lang):
    d = {}
    for p in sorted(glob.glob(os.path.join(HERE, "i18n", "js.%s*.tsv" % lang))):
        for line in open(p, encoding="utf-8"):
            line = line.rstrip("\n")
            if not line or line.startswith("#") or "\t" not in line:
                continue
            k, v = line.split("\t", 1)
            k, v = unesc_tsv(k), unesc_tsv(v)
            lead, trail = k[: len(k) - len(k.lstrip())], k[len(k.rstrip()):]
            d[k] = lead + v.strip() + trail
    return d


def build():
    ks = keys()
    missing = {}
    os.makedirs(os.path.join(ROOT, "js", "lang"), exist_ok=True)
    with open(os.path.join(HERE, "i18n", "js-units.tsv"), "w", encoding="utf-8") as f:
        for k in ks:
            f.write(esc(k) + "\n")
    for lang in ("es", "en"):
        d = load(lang)
        miss = [k for k in ks if k not in d]
        missing[lang] = miss
        with open(os.path.join(HERE, "i18n", "js-missing-%s.tsv" % lang), "w", encoding="utf-8") as f:
            for k in miss:
                f.write(esc(k) + "\n")
        used = {k: d[k] for k in ks if k in d}
        with open(os.path.join(ROOT, "js", "lang", lang + ".js"), "w", encoding="utf-8") as f:
            f.write("/* Generat per build/jsi18n.py. No editar a mà. */\nwindow.PSI_DICT=" + json.dumps(used, ensure_ascii=False, indent=0) + ";\n")
    return ks, missing
