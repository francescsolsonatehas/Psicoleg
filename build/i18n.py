# -*- coding: utf-8 -*-
"""Traducció de pàgines HTML generades (català → español / English).

Cada «unitat» de text (un paràgraf, un element de llista, un botó, un atribut...) s'identifica pel seu
HTML intern normalitzat. Les traduccions viuen a build/i18n/<lang>.tsv amb línies `hash<TAB>traducció`.
"""
import hashlib
import os
import re
from html.parser import HTMLParser

HERE = os.path.dirname(os.path.abspath(__file__))
LANGS = ["ca", "es", "en"]
BASE = "https://francescsolsonatehas.github.io/Psicoleg/"
LOCALE = {"ca": "ca_ES", "es": "es_ES", "en": "en_GB"}
LANG_NAME = {"ca": "Català", "es": "Español", "en": "English"}

VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}
INLINE = {"a", "abbr", "b", "br", "cite", "code", "em", "i", "kbd", "mark", "output", "q", "s", "small", "span", "strong", "sub", "sup", "u"}
SKIP = {"script", "style", "svg", "pre", "noscript"}
RAW = {"script", "style"}
ATTRS = {"placeholder", "aria-label", "title", "alt"}
NOTRANSLATE = {"Psicòleg"}


class Node:
    def __init__(self, tag, attrs):
        self.tag, self.attrs, self.children = tag, attrs, []


class Text:
    def __init__(self, data, raw=False):
        self.data, self.raw = data, raw


class Raw:
    def __init__(self, s):
        self.s = s


class Builder(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node("#root", [])
        self.stack = [self.root]

    def handle_starttag(self, tag, attrs):
        n = Node(tag, attrs)
        self.stack[-1].children.append(n)
        if tag not in VOID:
            self.stack.append(n)

    def handle_startendtag(self, tag, attrs):
        self.stack[-1].children.append(Node(tag, attrs))

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i].tag == tag:
                del self.stack[i:]
                return

    def handle_data(self, data):
        self.stack[-1].children.append(Text(data, self.stack[-1].tag in RAW))

    def handle_comment(self, data):
        self.stack[-1].children.append(Raw("<!--" + data + "-->"))

    def handle_decl(self, decl):
        self.stack[-1].children.append(Raw("<!" + decl + ">"))


def parse(html):
    b = Builder()
    b.feed(html)
    b.close()
    return b.root


def esc_text(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def esc_attr(s):
    return s.replace("&", "&amp;").replace('"', "&quot;")


def h6(s):
    return hashlib.sha1(s.encode("utf-8")).hexdigest()[:6]


def norm(s):
    return re.sub(r"\s+", " ", s).strip()


def has_letters(s):
    return re.search(r"[^\W\d_]", re.sub(r"<[^>]*>", "", s)) is not None


def inline_full(n):
    if isinstance(n, Raw):
        return False
    if isinstance(n, Text):
        return True
    return n.tag in INLINE and all(inline_full(c) for c in n.children)


class Ctx:
    def __init__(self, lang, path, tr, units=None):
        self.lang, self.path, self.tr, self.units, self.missing = lang, path, tr, units, set()


def fix_url(ctx, name, v):
    if ctx.lang == "ca" or name not in ("href", "src"):
        return v
    if re.match(r"^(\.\./)*(css|js|img|fonts)/", v):
        return "../" + v
    if v.startswith("/Psicoleg/"):
        rest = v[len("/Psicoleg/"):]
        if re.match(r"(css|js|img|fonts)/", rest):
            return v
        return "/Psicoleg/" + ctx.lang + "/" + rest
    return v


def attr_str(ctx, n, translate_attrs=True):
    out = []
    is_meta_desc = n.tag == "meta" and any(k == "name" and v == "description" for k, v in n.attrs) or \
        n.tag == "meta" and any(k == "property" and v in ("og:title", "og:description") for k, v in n.attrs)
    for k, v in n.attrs:
        if v is None:
            out.append(" " + k)
            continue
        if translate_attrs and (k in ATTRS or (k == "content" and is_meta_desc)):
            v = tr_unit(ctx, esc_attr(v)) if has_letters(v) else esc_attr(v)
            out.append(' %s="%s"' % (k, v))
            continue
        out.append(' %s="%s"' % (k, esc_attr(fix_url(ctx, k, v)) if translate_attrs else esc_attr(v)))
    return "".join(out)


def plain_node(ctx, n, translate_attrs=False):
    if isinstance(n, Text):
        return n.data if n.raw else esc_text(n.data)
    if isinstance(n, Raw):
        return n.s
    a = attr_str(ctx, n, translate_attrs)
    if n.tag in VOID:
        return "<%s%s>" % (n.tag, a)
    return "<%s%s>%s</%s>" % (n.tag, a, "".join(plain_node(ctx, c, translate_attrs) for c in n.children), n.tag)


def tr_unit(ctx, key):
    """Retorna la traducció d'una unitat (o la unitat original si no n'hi ha)."""
    k = norm(key)
    if norm(re.sub(r'<[^>]*>', '', k)) in NOTRANSLATE or not has_letters(k):
        return key
    if ctx.units is not None:
        ctx.units.setdefault(h6(k), k)
    if ctx.lang == "ca":
        return key
    t = ctx.tr.get(h6(k))
    if t is None:
        ctx.missing.add(k)
        return key
    return t


def compact(ctx, nodes):
    """Clau de la unitat: etiquetes amb atributs → <tag#i>; retorna (clau, llista d'atributs)."""
    attrs = []

    def comp(n):
        if isinstance(n, Text):
            return esc_text(n.data)
        if isinstance(n, Raw):
            return ""
        a = attr_str(ctx, n, True) if n.attrs else ""
        if n.tag in VOID:
            if a:
                attrs.append(a)
                return "<%s#%d>" % (n.tag, len(attrs) - 1)
            return "<%s>" % n.tag
        if a:
            attrs.append(a)
            o = "<%s#%d>" % (n.tag, len(attrs) - 1)
        else:
            o = "<%s>" % n.tag
        return o + "".join(comp(c) for c in n.children) + "</%s>" % n.tag

    return "".join(comp(c) for c in nodes), attrs


def expand(t, attrs):
    return re.sub(r"<([a-z0-9]+)#(\d+)>", lambda m: "<" + m.group(1) + attrs[int(m.group(2))] + ">", t)


def render_children(ctx, children):
    out, run = [], []

    def flush():
        if not run:
            return
        raw = "".join(plain_node(ctx, c, False) for c in run)
        if has_letters(raw):
            lead = raw[: len(raw) - len(raw.lstrip())]
            trail = raw[len(raw.rstrip()):]
            key, attrs = compact(ctx, run)
            if ctx.lang == "ca":
                tr_unit(ctx, key)
                out.append(raw)
            else:
                out.append(lead + expand(tr_unit(ctx, key), attrs) + trail)
        else:
            out.append("".join(plain_node(ctx, c, True) for c in run))
        run.clear()

    def deco(c):
        return isinstance(c, Node) and ("aria-hidden", "true") in c.attrs and not has_letters(plain_node(ctx, c, False))

    for c in children:
        if deco(c):
            flush()
            out.append(render(ctx, c))
        elif inline_full(c) and not (isinstance(c, Node) and c.tag in SKIP):
            run.append(c)
        else:
            flush()
            out.append(render(ctx, c))
    flush()
    return "".join(out)


def render(ctx, n):
    if isinstance(n, Text):
        return n.data if n.raw else esc_text(n.data)
    if isinstance(n, Raw):
        return n.s
    a = attr_str(ctx, n)
    if n.tag in VOID:
        return "<%s%s>" % (n.tag, a)
    if n.tag in SKIP:
        return "<%s%s>%s</%s>" % (n.tag, a, "".join(plain_node(ctx, c, False) for c in n.children), n.tag)
    return "<%s%s>%s</%s>" % (n.tag, a, render_children(ctx, n.children), n.tag)


def load_tr(lang):
    import glob
    d = {}
    files = sorted(glob.glob(os.path.join(HERE, "i18n", lang + ".tsv")) + glob.glob(os.path.join(HERE, "i18n", lang + ".*.tsv")))
    for p in files:
        for line in open(p, encoding="utf-8"):
            line = line.rstrip("\n")
            if not line or line.startswith("#") or "\t" not in line:
                continue
            h, tr = line.split("\t", 1)
            d[h] = tr
    return d


TR = {l: load_tr(l) for l in LANGS if l != "ca"}


def prefix(lang):
    return "" if lang == "ca" else lang + "/"


def switcher(lang, path):
    here = os.path.dirname(os.path.join(prefix(lang), path)) or "."
    items = []
    for m in LANGS:
        href = os.path.relpath(os.path.join(prefix(m), path), here).replace(os.sep, "/")
        cur = ' aria-current="true"' if m == lang else ""
        items.append('<a href="%s" lang="%s" hreflang="%s"%s>%s</a>' % (href, m, m, cur, m.upper()))
    return '<nav class="langsw" aria-label="Idioma / Idioma / Language">' + "".join(items) + "</nav>"


def finalize(html, lang, path):
    page_url = BASE + prefix(lang) + path
    alts = "".join('<link rel="alternate" hreflang="%s" href="%s">\n' % (m, BASE + prefix(m) + path) for m in LANGS)
    alts += '<link rel="alternate" hreflang="x-default" href="%s">\n' % (BASE + path)
    html = html.replace('<html lang="ca">', '<html lang="%s">' % lang, 1)
    html = re.sub(r'<link rel="canonical" href="[^"]*">', '<link rel="canonical" href="%s">' % page_url, html, 1)
    html = re.sub(r'(<meta property="og:url" content=")[^"]*(">)', r"\g<1>" + page_url + r"\g<2>", html, 1)
    html = html.replace('content="ca_ES"', 'content="%s"' % LOCALE[lang], 1)
    html = html.replace('"inLanguage":"ca"', '"inLanguage":"%s"' % lang)
    if "<!--LANGSW-->" in html:
        html = html.replace("<!--LANGSW-->", switcher(lang, path), 1)
    html = html.replace("</head>", alts + "</head>", 1)
    if lang != "ca":
        html = re.sub(r'(<script src="((?:\.\./)*)js/i18n\.js" defer></script>)',
                      lambda m: '<script src="%sjs/lang/%s.js" defer></script>\n%s' % (m.group(2), lang, m.group(1)), html, 1)
    return html


def hub_search_text(html):
    """Recalcula data-text de les targetes amb el títol i el resum ja traduïts."""
    def fix(m):
        card = m.group(0)
        t = re.search(r"<h3>(.*?)</h3>", card)
        s = re.search(r'<p class="muted">(.*?)</p>', card)
        if not (t and s):
            return card
        txt = re.sub(r"<[^>]+>", "", t.group(1) + " " + s.group(1)).lower().replace('"', "&quot;")
        return re.sub(r'data-text="[^"]*"', 'data-text="%s"' % txt, card, 1)
    return re.sub(r'<a class="card"[^>]*data-text=.*?</a>', fix, html, flags=re.S)


def localized(path, html_ca, units=None):
    """Retorna {lang: (ruta, html)} per a una pàgina en català."""
    svgs = []

    def stash(m):
        svgs.append(m.group(0))
        return "<!--SVG:%d-->" % (len(svgs) - 1)

    html_ca = re.sub(r"<svg\b.*?</svg>", stash, html_ca, flags=re.S)
    root = parse(html_ca)
    out, missing = {}, {}
    for lang in LANGS:
        ctx = Ctx(lang, path, TR.get(lang, {}), units if lang == "ca" else None)
        h = render_children(ctx, root.children)
        h = re.sub(r"<!--SVG:(\d+)-->", lambda m: svgs[int(m.group(1))], h)
        if lang != "ca":
            h = hub_search_text(h)
        h = finalize(h, lang, path)
        out[lang] = (prefix(lang) + path, h)
        missing[lang] = ctx.missing
    return out, missing
