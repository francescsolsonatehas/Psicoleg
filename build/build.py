# -*- coding: utf-8 -*-
import os, html, sys
sys.path.insert(0, os.path.dirname(__file__))
import i18n
import jsi18n
import searchindex
from data import CONDITIONS, GROUPS, REVIEWERS, CONTENT_UPDATED

OUT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = "https://francescsolsonatehas.github.io/Psicoleg/"
NAME = "Psicòleg"
e = html.escape

NAV = [("index.html", "Inici"), ("trastorns.html", "Trastorns"), ("eines.html", "Eines"),
       ("cribratges.html", "Cribratges"), ("parlar-ne.html", "Com parlar-ne"), ("joves.html", "Joves"), ("familiars.html", "Familiars"), ("ajuda.html", "Trobar ajuda")]

FOOT_EXTRA = [("pla.html", "El meu pla"), ("cerca.html", "Cerca i índex")]

LOGO = '<svg viewBox="0 0 40 40" aria-hidden="true"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3f7d6e"/><stop offset="1" stop-color="#6c8ebf"/></linearGradient></defs><circle cx="20" cy="20" r="19" fill="url(#g)"/><path d="M20 28c-6-4-9-7.5-9-11a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 3.500-3 7-9 11z" fill="#fff" opacity=".95"/></svg>'


def page(path, title, desc, body, current="", root="", extra_head="", ld=""):
    AC = ' aria-current="page"'
    nav = "".join(
        f'<li><a href="{root}{h}"{AC if h == current else ""}>{t}</a></li>' for h, t in NAV)
    foot_nav = "".join(f'<li><a href="{root}{h}">{t}</a></li>' for h, t in NAV + FOOT_EXTRA)
    url = BASE + path
    return f'''<!DOCTYPE html>
<html lang="ca">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="noindex, nofollow, noarchive, noimageindex">
<title>{e(title)}</title>
<meta name="description" content="{e(desc)}">
<link rel="canonical" href="{url}">
<link rel="icon" type="image/svg+xml" href="{root}img/favicon.svg">
<link rel="apple-touch-icon" href="{root}img/apple-touch-icon.png">
<meta name="theme-color" content="#3f7d6e">
<meta property="og:title" content="{e(title)}">
<meta property="og:description" content="{e(desc)}">
<meta property="og:type" content="website">
<meta property="og:url" content="{url}">
<meta property="og:site_name" content="{NAME}">
<meta property="og:locale" content="ca_ES">
<meta property="og:image" content="{BASE}img/og-image.png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="preload" as="font" type="font/woff2" href="{root}fonts/inter-latin.woff2" crossorigin>
<link rel="preload" as="font" type="font/woff2" href="{root}fonts/poppins-700-latin.woff2" crossorigin>
<link rel="stylesheet" href="{root}css/style.css">
<script>try{{var t=localStorage.getItem('psi-theme');if(!t&&matchMedia('(prefers-color-scheme: dark)').matches)t='dark';if(t)document.documentElement.setAttribute('data-theme',t);var f=localStorage.getItem('psi-fs');if(f)document.documentElement.style.setProperty('--fs',f)}}catch(e){{}}</script>
{ld}{extra_head}
</head>
<body>
<a class="skip" href="#main">Salta al contingut</a>
<header class="site-header"><div class="container nav">
  <a class="brand" href="{root}index.html">{LOGO}<span>{NAME}</span></a>
  <nav aria-label="Navegació principal"><ul id="menu">{nav}</ul></nav>
  <div class="tools">
    <!--LANGSW-->
    <a class="icon-btn" href="{root}cerca.html" aria-label="Cercar al web"{AC if current == "cerca.html" else ""}>🔍</a>
    <button class="icon-btn" id="fs-down" aria-label="Reduir la mida del text">A−</button>
    <button class="icon-btn" id="fs-up" aria-label="Augmentar la mida del text">A+</button>
    <button class="icon-btn" id="theme" aria-label="Canviar entre mode clar i fosc">🌓</button>
    <button class="icon-btn menu-btn" id="menu-btn" aria-label="Obrir el menú" aria-expanded="false" aria-controls="menu">☰</button>
  </div>
</div></header>
<main id="main">
{body}
</main>
<footer class="site-footer"><div class="container">
  <div class="foot">
    <div><p class="fh">{NAME}</p><p>Informació i eines per cuidar la salut mental. Contingut informatiu: no substitueix l'atenció d'un professional sanitari.</p></div>
    <div><p class="fh">Seccions</p><ul>{foot_nav}</ul></div>
    <div><p class="fh">Legal</p><ul><li><a href="{root}fonts-i-revisio.html">Qui ho revisa i fonts</a></li><li><a href="{root}avis-legal.html">Avís legal i mèdic</a></li><li><a href="{root}privacitat.html">Privacitat i cookies</a></li></ul></div>
  </div>
  <p class="copy">© 2026 {NAME}. Les tipografies Inter i Poppins es distribueixen sota la llicència SIL OFL 1.1.</p>
</div></footer>
<div class="sos" role="region" aria-label="Ajuda urgent">
  <span>🆘 Necessites ajuda ara?</span>
  <a href="tel:112">112 Emergències</a>
  <a href="tel:024">024 Conducta suïcida (24 h, gratuït)</a>
  <a class="sos-btn" href="{root}ajuda.html">Més recursos</a>
</div>
<script src="{root}js/i18n.js" defer></script>
<script src="{root}js/main.js" defer></script>
<script src="{root}js/lectura.js" defer></script>
{{SCRIPTS}}
</body>
</html>'''


def with_scripts(h, scripts=()):
    def tag(s):
        if s.startswith("module:"):
            return f'<script type="module" src="{s[7:]}"></script>'
        return f'<script src="{s}" defer></script>'
    return h.replace("{SCRIPTS}", "".join(tag(s) for s in scripts))


UNITS = {}
MISSING = {"es": set(), "en": set()}
PAGES = {}  # (llengua, ruta) -> HTML final, per construir l'índex del cercador


def _write(path, content):
    full = os.path.join(OUT, path)
    os.makedirs(os.path.dirname(full), exist_ok=True)
    with open(full, "w", encoding="utf-8") as f:
        f.write(content)


def write(path, content):
    if path.endswith(".html") and path != "404.html":
        res, miss = i18n.localized(path, content, UNITS)
        for lang, (p, h) in res.items():
            _write(p, h)
            PAGES[(lang, path)] = h
        for lang in ("es", "en"):
            MISSING[lang] |= miss[lang]
    else:
        _write(path, content.replace("<!--LANGSW-->", ""))


def li(items):
    return "<ul>" + "".join(f"<li>{e(i)}</li>" for i in items) + "</ul>"


SOURCES = ('<p class="sources"><strong>Fonts per ampliar informació:</strong> '
           '<a href="https://www.who.int/health-topics/mental-health" rel="noopener">OMS – Salut mental</a> · '
           '<a href="https://canalsalut.gencat.cat" rel="noopener">Canal Salut (Generalitat de Catalunya)</a> · '
           '<a href="https://www.nice.org.uk/guidance/conditions-and-diseases/mental-health-behavioural-and-neurodevelopmental-conditions" rel="noopener">Guies clíniques NICE</a>. '
           'Classificacions de referència: CIE-11 i DSM-5-TR.</p>')


def review_note(root=""):
    """Línia de revisió professional i data d'actualització (al peu de fitxes i guies)."""
    link = f'<a href="{root}fonts-i-revisio.html">Qui ho revisa i fonts</a>'
    if REVIEWERS:
        who = "; ".join(f'{e(r["name"])} ({e(r["role"])}, {e(r["college"])}, {e(r["date"])})' for r in REVIEWERS)
        return f'<p class="sources"><strong>Revisió professional:</strong> {who}. {link}.</p>'
    return (f'<p class="sources"><strong>Revisió professional:</strong> pendent. '
            f'Contingut actualitzat el {CONTENT_UPDATED}. {link}.</p>')


def add_review(body, root=""):
    i = body.rindex("</div></section>")
    return body[:i] + review_note(root) + "\n" + body[i:]


# ---------- Fitxes de trastorns ----------
for c in CONDITIONS:
    mites = "".join(f'<div class="myth"><b>Mite:</b> {e(m)}<br><b style="color:var(--ok)">Realitat:</b> {e(r)}</div>' for m, r in c["myths"])
    crisi = ''
    if c["slug"] == "ansietat-social":
        crisi = '<div class="notice soft"><strong>Eines de TCC per a l\'ansietat social</strong>Jerarquia d\'exposició, registre de pensaments i experiments conductuals. <a href="../ansietat-social-eines.html">Obre les eines →</a></div>'
    if c["slug"] in ("depressio", "autolesions-suicidi", "trastorn-limit-personalitat"):
        crisi = '<div class="notice warn" role="alert"><strong>Si estàs en perill ara</strong>Truca al <a href="tel:112">112</a> o al <a href="tel:024">024</a> (gratuït, 24 h). No cal que estiguis sol/a amb això.</div>'
    body = f'''
<section class="page-hero"><div class="container narrow">
  <p class="crumbs"><a href="../trastorns.html">← Tots els trastorns</a></p>
  <span class="tag">{e(c["group"])}</span>
  <h1>{c["icon"]} {e(c["name"])}</h1>
  <p class="lead muted">{e(c["summary"])}</p>
</div></section>
<section style="padding-top:20px"><div class="container narrow article" data-read>
  {crisi}
  <div class="notice"><strong>Informació, no diagnòstic</strong>Aquesta fitxa és informativa. Només un professional pot valorar la teva situació.</div>
  <h2>Què és</h2><p>{e(c["what"])}</p>
  <h2>Símptomes habituals</h2>{li(c["symptoms"])}
  <h2>Mites i realitats</h2>{mites}
  <h2>Quan consultar un professional</h2><p>{e(c["when"])}</p>
  <h2>Quins tractaments recomanen les guies clíniques</h2><p>{e(c["treatment"])}</p>
  <h2>Consells per a familiars i amics</h2>{li(c["family"])}
  <div class="btn-row"><a class="btn btn-primary" href="../ajuda.html">Trobar ajuda</a><a class="btn btn-outline" href="../eines.html">Eines d'autoajuda</a></div>
  {SOURCES}
  {review_note('../')}
</div></section>'''
    ld = f'<script type="application/ld+json">{{"@context":"https://schema.org","@type":"MedicalWebPage","name":"{e(c["name"])}","inLanguage":"ca","about":{{"@type":"MedicalCondition","name":"{e(c["name"])}"}}}}</script>'
    write(f"trastorns/{c['slug']}.html", with_scripts(
        page(f"trastorns/{c['slug']}.html", f"{c['name']} – símptomes i ajuda | {NAME}", c["summary"], body, "trastorns.html", "../", ld=ld)))

# ---------- Hub de trastorns ----------
cards = "".join(
    f'<a class="card" data-group="{e(c["group"])}" data-text="{e((c["name"]+" "+c["summary"]).lower())}" href="trastorns/{c["slug"]}.html">'
    f'<span class="ico" aria-hidden="true">{c["icon"]}</span><span class="tag">{e(c["group"])}</span><h3>{e(c["name"])}</h3><p class="muted">{e(c["summary"])}</p></a>'
    for c in CONDITIONS)
chips = '<button class="chip" aria-pressed="true" data-g="">Tots</button>' + "".join(
    f'<button class="chip" aria-pressed="false" data-g="{e(g)}">{e(g)}</button>' for g in GROUPS)
body = f'''
<section class="page-hero"><div class="container">
  <span class="eyebrow">Psicoeducació</span><h1>Trastorns i condicions</h1>
  <p class="lead muted" style="max-width:680px">Fitxes en llenguatge senzill: què són, com es reconeixen, quins mites hi ha i quan demanar ajuda.</p>
  <div class="notice"><strong>No és un diagnòstic</strong>Ningú no es pot diagnosticar llegint una web. Si et reconeixes en alguna fitxa, parla-ho amb un professional.</div>
  <label class="sr-only" for="q" style="position:absolute;left:-999px">Cerca un trastorn</label>
  <input id="q" class="search" type="search" placeholder="Cerca (p. ex. ansietat, son, pànic...)">
  <div class="filters" role="group" aria-label="Filtrar per categoria">{chips}</div>
</div></section>
<section style="padding-top:10px"><div class="container">
  <h2 class="sr-only">Llista de trastorns</h2>
  <div class="grid grid-3" id="cards">{cards}</div>
  <p id="empty" class="muted" hidden>No hem trobat cap resultat. Prova amb un altre terme.</p>
</div></section>'''
write("trastorns.html", with_scripts(
    page("trastorns.html", f"Trastorns i condicions de salut mental | {NAME}", "Fitxes psicoeducatives sobre ansietat, depressió, TOC, TDAH, trastorns alimentaris i més.", body, "trastorns.html"),
    ["js/hub.js"]))

# ---------- Inici ----------
tiles = [("🫁", "Respira", "Exercicis guiats de respiració per calmar-te en pocs minuts.", "eines.html#respiracio"),
         ("📓", "Registre d'ànim", "Apunta com et sents. Es guarda només al teu dispositiu.", "eines.html#anim"),
         ("🧠", "Diari de pensaments", "Una eina de teràpia cognitiva per mirar els pensaments amb distància.", "eines.html#pensaments"),
         ("📋", "Cribratges PHQ-9 i GAD-7", "Qüestionaris orientatius sobre ànim i ansietat.", "cribratges.html"),
         ("🧭", "El meu pla", "Respon cinc preguntes i rep un pla de petits passos pensat per a tu.", "pla.html"),
         ("📚", "Entendre el que sento", "Fitxes sobre 21 trastorns i condicions.", "trastorns.html"),
         ("🌱", "Eines de TCC", "Activació conductual, diari de son i registre de pànic.", "eines-tcc.html"),
         ("💬", "Com parlar-ne", "Frases i consells per dir-ho a la família, al metge i a la feina.", "parlar-ne.html"),
         ("🧑‍🎓", "Per a joves", "Informació clara i propera per a adolescents i joves.", "joves.html"),
         ("🏥", "Trobar ajuda professional", "On acudir a Catalunya: CAP, CSMA, línies d'ajuda.", "ajuda.html"),
         ("🔎", "Cerca i índex", "Cerca per paraules a tot el web o busca un tema a l'índex alfabètic.", "cerca.html"),
         ("🔬", "Qui ho revisa i fonts", "D'on surt la informació, com es revisa i què encara està pendent.", "fonts-i-revisio.html")]
tcards = "".join(f'<a class="card" href="{h}"><span class="ico" aria-hidden="true">{i}</span><h3>{t}</h3><p class="muted">{d}</p></a>' for i, t, d, h in tiles)
body = f'''
<section class="hero"><div class="container hero-grid">
  <div>
    <span class="eyebrow">Salut mental · en català</span>
    <h1>Un espai tranquil per entendre't i cuidar-te</h1>
    <p class="lead">Informació clara, eines pràctiques d'autoajuda i camins per trobar un professional. Sense judicis, sense registre, sense recollir dades.</p>
    <div class="btn-row">
      <a class="btn btn-danger" href="ajuda.html#urgent">Necessito ajuda ara</a>
      <a class="btn btn-primary" href="trastorns.html">Vull entendre el que sento</a>
      <a class="btn btn-outline" href="eines.html">Eines per al dia a dia</a>
    </div>
  </div>
  <div class="orb" aria-hidden="true"></div>
</div></section>
<section><div class="container">
  <div class="notice warn"><strong>Aquesta web no substitueix un professional</strong>No diagnostica ni prescriu tractaments. Si estàs en crisi, truca al 112 o al 024. Pots tenir una vida millor, i demanar ajuda és un acte de valentia.</div>
</div></section>
<section class="band"><div class="container">
  <h2>Per on vols començar?</h2>
  <div class="grid grid-3">{tcards}</div>
</div></section>
<section><div class="container narrow">
  <h2>Com funciona</h2>
  <div class="grid grid-3">
    <div class="card"><h3>1. Entén</h3><p class="muted">Llegeix fitxes basades en fonts fiables com l'OMS i les guies clíniques.</p></div>
    <div class="card"><h3>2. Practica</h3><p class="muted">Utilitza eines senzilles per gestionar el malestar del dia a dia.</p></div>
    <div class="card"><h3>3. Demana ajuda</h3><p class="muted">Troba el professional o servei que et pot acompanyar.</p></div>
  </div>
  <div class="notice soft" style="margin-top:28px"><strong>La teva privacitat</strong>No hi ha comptes ni servidors. Els registres es guarden únicament al teu navegador i els pots esborrar quan vulguis.</div>
</div></section>'''
ld = f'<script type="application/ld+json">{{"@context":"https://schema.org","@type":"WebSite","name":"{NAME}","url":"{BASE}","inLanguage":"ca","description":"Informació, eines d\'autoajuda i recursos de salut mental en català."}}</script>'
write("index.html", with_scripts(page("index.html", f"{NAME} – Salut mental: informació, eines i recursos", "Informació clara sobre salut mental, eines d'autoajuda i recursos per trobar ajuda professional a Catalunya.", body, "index.html", ld=ld)))

# ---------- Eines ----------
body = '''
<section class="page-hero"><div class="container narrow">
  <span class="eyebrow">Autoajuda</span><h1>Eines per al dia a dia</h1>
  <p class="lead muted">Exercicis breus basats en tècniques conegudes. Són un suport, no un tractament.</p>
  <div class="notice"><strong>Atenció</strong>Si algun exercici t'incomoda o et fa sentir pitjor, atura'l. Si estàs en crisi, vés a <a href="ajuda.html#urgent">ajuda urgent</a>.</div>
</div></section>
<section style="padding-top:10px"><div class="container narrow">

<div class="tool" id="respiracio">
  <h2>🫁 Respiració guiada</h2>
  <p class="muted">Segueix el cercle. Escull un patró i respira pel nas si pots.</p>
  <div class="field"><label for="b-mode">Patró</label>
    <select id="b-mode">
      <option value="4,0,6,0">Calmant: inspira 4 · expira 6</option>
      <option value="4,4,4,4">Quadrada: 4 · 4 · 4 · 4</option>
      <option value="4,7,8,0">4-7-8</option>
    </select></div>
  <div class="breath-wrap">
    <div class="breath-circle" id="b-circle" role="img" aria-label="Cercle de respiració"><span id="b-text">Preparat/da?</span></div>
    <p id="b-live" class="muted" aria-live="polite">Prem començar quan vulguis.</p>
    <button class="btn btn-primary" id="b-btn">Començar</button>
  </div>
</div>

<div class="tool" id="grounding">
  <h2>🌿 Grounding 5-4-3-2-1</h2>
  <p class="muted">Ajuda a tornar al present quan l'ansietat o els pensaments t'envaeixen.</p>
  <div class="progress"><i id="g-bar"></i></div>
  <div class="step-box" aria-live="polite"><div class="big" id="g-title">5 coses que veus</div><p id="g-text" class="muted">Mira al teu voltant i anomena en veu baixa o mentalment cinc coses que veus.</p></div>
  <div class="btn-row"><button class="btn btn-outline btn-sm" id="g-prev">Anterior</button><button class="btn btn-primary btn-sm" id="g-next">Següent</button></div>
</div>

<div class="tool" id="relaxacio">
  <h2>💆 Relaxació muscular progressiva</h2>
  <p class="muted">Tensa cada grup muscular uns 5 segons i deixa anar durant 10. Fes-ho assegut/da o estirat/da.</p>
  <div class="progress"><i id="r-bar"></i></div>
  <div class="step-box" aria-live="polite"><div class="big" id="r-title">Preparat/da?</div><p id="r-text" class="muted">Prem començar per guiar-te pas a pas.</p></div>
  <div class="btn-row"><button class="btn btn-primary btn-sm" id="r-btn">Començar</button></div>
</div>

<div class="tool" id="anim">
  <h2>📓 Registre d'estat d'ànim</h2>
  <p class="muted">Es guarda només al teu navegador. Ningú més no ho veu.</p>
  <div class="field"><span class="lbl" id="m-lbl">Com et sents ara?</span>
    <div class="mood-row" role="group" aria-labelledby="m-lbl">
      <button data-v="1" aria-pressed="false" aria-label="Molt malament">😞</button>
      <button data-v="2" aria-pressed="false" aria-label="Malament">🙁</button>
      <button data-v="3" aria-pressed="false" aria-label="Regular">😐</button>
      <button data-v="4" aria-pressed="false" aria-label="Bé">🙂</button>
      <button data-v="5" aria-pressed="false" aria-label="Molt bé">😄</button>
    </div></div>
  <div class="field"><label for="m-note">Nota (opcional)</label><input type="text" id="m-note" maxlength="200" placeholder="Què ha passat avui?"></div>
  <button class="btn btn-primary btn-sm" id="m-save">Desar</button>
  <div class="spark" id="m-spark" aria-hidden="true"></div>
  <ul class="log" id="m-log"></ul>
  <div class="btn-row"><button class="btn btn-outline btn-sm" id="m-export">Descarregar (CSV)</button><button class="btn btn-outline btn-sm" id="m-clear">Esborrar tot</button></div>
</div>

<div class="tool" id="pensaments">
  <h2>🧠 Diari de pensaments (TCC)</h2>
  <p class="muted">Posa nom al pensament, mira'n les proves i busca una versió més equilibrada.</p>
  <div class="field"><label for="t-sit">1. Situació</label><textarea id="t-sit" placeholder="Què va passar? On eres?"></textarea></div>
  <div class="field"><label for="t-th">2. Pensament automàtic</label><textarea id="t-th" placeholder="Quin pensament et va venir al cap?"></textarea></div>
  <div class="field"><label for="t-em">3. Emoció i intensitat (0-100)</label><input type="text" id="t-em" placeholder="Ex.: por 80"></div>
  <div class="field"><label for="t-for">4. Proves a favor del pensament</label><textarea id="t-for"></textarea></div>
  <div class="field"><label for="t-ag">5. Proves en contra</label><textarea id="t-ag"></textarea></div>
  <div class="field"><label for="t-alt">6. Pensament alternatiu més equilibrat</label><textarea id="t-alt" placeholder="Què li diria a un amic que pensés això?"></textarea></div>
  <div class="btn-row"><button class="btn btn-primary btn-sm" id="t-save">Desar</button><button class="btn btn-outline btn-sm" id="t-clear">Esborrar entrades</button></div>
  <h3 style="margin-top:24px">Entrades anteriors</h3>
  <ul class="log" id="t-log"></ul>
</div>

<div class="card" style="margin-bottom:28px"><h2>🧭 El meu pla</h2><p class="muted">Cinc preguntes sobre les últimes dues setmanes i una proposta de petits passos, amb enllaços a les eines.</p><div class="btn-row"><a class="btn btn-primary btn-sm" href="pla.html">Fer el meu pla</a></div></div>

<div class="card" style="margin-bottom:28px"><h2>🌱 Més eines de TCC</h2><p class="muted">Activació conductual per a la depressió, diari de son i registre de pànic.</p><div class="btn-row"><a class="btn btn-primary btn-sm" href="eines-tcc.html">Obrir les eines</a></div></div>

<div class="card" style="margin-bottom:28px"><h2>📦 Les meves dades</h2><p class="muted">Imprimeix o descarrega els teus registres per portar-los a la consulta, fes còpies i crea recordatoris.</p><div class="btn-row"><a class="btn btn-primary btn-sm" href="meves-dades.html">Obrir</a></div></div>

<div class="card"><h2>🫥 Ansietat social</h2><p class="muted">Eines específiques de TCC: jerarquia d'exposició, registre de pensaments socials i experiments conductuals.</p><div class="btn-row"><a class="btn btn-primary btn-sm" href="ansietat-social-eines.html">Obrir les eines</a></div></div>

</div></section>'''
write("eines.html", with_scripts(page("eines.html", f"Eines d'autoajuda: respiració, grounding i registre d'ànim | {NAME}", "Respiració guiada, grounding 5-4-3-2-1, relaxació muscular, registre d'ànim i diari de pensaments. Tot es guarda al teu dispositiu.", body, "eines.html"), ["js/eines.js"]))

# ---------- Ansietat social: eines TCC ----------
DIST = ["Lectura de ment (crec saber què pensen)", "Catastrofisme (ho veig pitjor del que és)", "Personalització (tot gira al meu voltant)", "Etiquetatge («sóc un fracàs»)", "Filtre mental (només veig el negatiu)", "Hauria de... (exigències rígides)"]
dist_html = "".join(f'<label class="chk"><input type="checkbox" name="dist" value="{i}"> {d}</label>' for i, d in enumerate(DIST))
body = f"""
<section class="page-hero"><div class="container narrow">
  <p class="crumbs"><a href="eines.html">← Totes les eines</a></p>
  <span class="eyebrow">Teràpia cognitivo-conductual</span><h1>Ansietat social: eines de TCC</h1>
  <p class="lead muted">Tres eines per treballar la por a ser jutjat: ordenar el que evites, qüestionar els pensaments i comprovar-ho a la pràctica.</p>
  <div class="notice"><strong>Un suport, no un tractament</strong>Funcionen millor acompanyades d'un psicòleg. Tot es guarda només al teu navegador. Si et sents desbordat/da, atura't i mira <a href="ajuda.html#urgent">ajuda urgent</a>.</div>
</div></section>
<section style="padding-top:10px"><div class="container narrow">

<div class="tool" id="exposicio">
  <h2>🪜 1. Jerarquia d'exposició</h2>
  <p class="muted">Llista situacions socials que evites o et costen, i puntua la por de 0 (cap) a 100 (màxima). Comença per les de puntuació baixa i puja gradualment. Repeteix cada situació fins que la por baixi.</p>
  <div class="field"><label for="x-sit">Situació</label><input type="text" id="x-sit" maxlength="140" placeholder="Ex.: saludar un veí, preguntar l'hora a un desconegut..."></div>
  <div class="field"><label for="x-score">Por esperada: <output id="x-out">40</output>/100</label><input type="range" id="x-score" min="0" max="100" step="5" value="40" style="width:100%"></div>
  <button class="btn btn-primary btn-sm" id="x-add">Afegir a l'escala</button>
  <ol class="log" id="x-list" style="margin-top:18px;list-style:none"></ol>
  <p class="muted" style="font-size:.9rem">Consell: tria un pas que et doni uns 30-50 de por, no el més difícil. Quedar-te a la situació fins que l'ansietat baixi t'ensenya que la pots tolerar.</p>
  <div class="btn-row"><button class="btn btn-outline btn-sm" id="x-clear">Esborrar l'escala</button></div>
</div>

<div class="tool" id="pensaments-soc">
  <h2>🧠 2. Registre de pensaments socials</h2>
  <p class="muted">Per a després d'una situació (o abans). Posa les teves prediccions a prova.</p>
  <div class="field"><label for="p-sit">Situació social</label><textarea id="p-sit" placeholder="Què va passar o què passarà? Amb qui?"></textarea></div>
  <div class="field"><label for="p-pred">Què crec que passarà o què van pensar de mi</label><textarea id="p-pred" placeholder="Ex.: pensaran que sóc avorrit"></textarea></div>
  <div class="field"><label for="p-b1">Quant m'ho crec ara: <output id="p-o1">60</output>%</label><input type="range" id="p-b1" min="0" max="100" step="5" value="60" style="width:100%"></div>
  <fieldset class="field" style="border:0;padding:0;margin:0 0 14px"><legend class="lbl">Distorsions que reconec (opcional)</legend><div class="chk-grid">{dist_html}</div></fieldset>
  <div class="field"><label for="p-for">Proves a favor</label><textarea id="p-for" placeholder="Fets concrets, no sensacions"></textarea></div>
  <div class="field"><label for="p-ag">Proves en contra</label><textarea id="p-ag" placeholder="Altres vegades que ha anat bé, què va fer l'altra persona..."></textarea></div>
  <div class="field"><label for="p-alt">Pensament alternatiu més realista</label><textarea id="p-alt" placeholder="Què li diria a un bon amic en aquesta situació?"></textarea></div>
  <div class="field"><label for="p-b2">Ara, quant m'ho crec: <output id="p-o2">40</output>%</label><input type="range" id="p-b2" min="0" max="100" step="5" value="40" style="width:100%"></div>
  <div class="btn-row"><button class="btn btn-primary btn-sm" id="p-save">Desar</button><button class="btn btn-outline btn-sm" id="p-clear">Esborrar entrades</button></div>
  <h3 style="margin-top:24px">Entrades anteriors</h3><ul class="log" id="p-log"></ul>
</div>

<div class="tool" id="experiments">
  <h2>🔬 3. Experiments conductuals</h2>
  <p class="muted">Una prova de la teva predicció. Primer escriu què creus que passarà, després fes-ho i anota què ha passat de debò.</p>
  <h3>Abans</h3>
  <div class="field"><label for="e-do">Què faré (concret i petit)</label><input type="text" id="e-do" maxlength="160" placeholder="Ex.: dir bon dia al company i fer una pregunta"></div>
  <div class="field"><label for="e-pred">Què crec que passarà</label><input type="text" id="e-pred" maxlength="200" placeholder="Ex.: es quedarà en silenci i em mirarà estrany"></div>
  <div class="field"><label for="e-a1">Ansietat prevista: <output id="e-o1">60</output>/100</label><input type="range" id="e-a1" min="0" max="100" step="5" value="60" style="width:100%"></div>
  <p class="muted" style="font-size:.9rem">Prova de no usar «conductes de seguretat» (evitar la mirada, mirar el mòbil, repetir-te el guió). Ens fan creure que només anem bé gràcies a elles.</p>
  <button class="btn btn-primary btn-sm" id="e-add">Planificar experiment</button>
  <h3 style="margin-top:24px">Els teus experiments</h3>
  <ul class="log" id="e-list"></ul>
  <div class="btn-row"><button class="btn btn-outline btn-sm" id="e-clear">Esborrar experiments</button></div>
</div>

<div class="card" style="margin-bottom:28px"><h2>🤖 Assistent amb IA (experimental)</h2><p class="muted">Practica converses socials i reformula pensaments amb un model que s'executa al teu dispositiu.</p><div class="btn-row"><a class="btn btn-primary btn-sm" href="ansietat-social-assistent.html">Provar l'assistent</a></div></div>

<div class="notice soft"><strong>I si em costa massa?</strong>És normal. Fes passos més petits o parla-ho amb un psicòleg: la TCC amb exposició és el tractament amb més evidència per a l'ansietat social. <a href="trastorns/ansietat-social.html">Llegeix la fitxa</a> · <a href="ajuda.html">Trobar ajuda</a></div>
</div></section>"""
write("ansietat-social-eines.html", with_scripts(page("ansietat-social-eines.html", f"Ansietat social: eines de TCC | {NAME}", "Jerarquia d'exposició, registre de pensaments i experiments conductuals per treballar l'ansietat social amb TCC.", body, "eines.html"), ["js/social.js"]))

# ---------- Eines TCC: activació conductual, son, pànic ----------
body = """
<section class="page-hero"><div class="container narrow">
  <p class="crumbs"><a href="eines.html">← Totes les eines</a></p>
  <span class="eyebrow">TCC · autoajuda</span><h1>Activació conductual, diari de son i registre de pànic</h1>
  <p class="lead muted">Tres eines de teràpia cognitivo-conductual per a la depressió, l'insomni i l'ansietat. Es guarden només al teu navegador.</p>
  <div class="notice"><strong>Un suport, no un tractament</strong>Si fa setmanes que et sents malament, t'han passat atacs de pànic repetits o no dorms des de fa mesos, parla-ho amb el teu metge o un psicòleg. <a href="ajuda.html">Trobar ajuda</a></div>
</div></section>
<section style="padding-top:10px"><div class="container narrow">

<div class="tool" id="activacio">
  <h2>🌱 Activació conductual (depressió)</h2>
  <p class="muted">Quan estàs decaigut/da, l'impuls és fer menys, i això empitjora l'ànim. La idea és al revés: <strong>fer primer, i la motivació ja vindrà</strong>. Planifica activitats petites, i anota després quin plaer i domini t'han donat de veritat.</p>
  <div class="field"><label for="ba-act">Activitat (petita i concreta)</label><input type="text" id="ba-act" maxlength="140" placeholder="Ex.: caminar 10 minuts, trucar a una amiga, fer una dutxa"></div>
  <div class="field"><label for="ba-cat">Tipus</label>
    <select id="ba-cat"><option value="cura">Cura personal</option><option value="social">Social</option><option value="moviment">Moviment</option><option value="domini">Tasques i responsabilitats</option><option value="plaer">Plaer i oci</option></select></div>
  <div class="field"><label for="ba-pl">Plaer que crec que tindrà: <output id="ba-opl">3</output>/10</label><input type="range" id="ba-pl" min="0" max="10" step="1" value="3" style="width:100%"></div>
  <div class="field"><label for="ba-mas">Sensació de domini (haver-ho aconseguit): <output id="ba-omas">3</output>/10</label><input type="range" id="ba-mas" min="0" max="10" step="1" value="3" style="width:100%"></div>
  <button class="btn btn-primary btn-sm" id="ba-add">Planificar</button>
  <p class="muted" id="ba-sum" aria-live="polite" style="margin-top:14px"></p>
  <h3 style="margin-top:20px">Les teves activitats</h3>
  <ul class="log" id="ba-list"></ul>
  <div class="btn-row"><button class="btn btn-outline btn-sm" id="ba-clear">Esborrar activitats</button></div>
  <div class="notice soft" style="margin-top:18px"><strong>Consells</strong>Comença amb coses de 5-10 minuts. Tria-ne que et donin plaer <em>i</em> d'altres que et donin sensació de domini. No esperis tenir ganes: planifica el moment (dia i hora). Si l'ànim baix dura setmanes o pensaments de fer-te mal, consulta ja: 024 o 112.</div>
</div>

<div class="tool" id="son">
  <h2>🌙 Diari de son</h2>
  <p class="muted">Apunta-ho cada matí (2 minuts). Amb una o dues setmanes de dades, tu i el professional podeu veure patrons.</p>
  <div class="grid grid-2">
    <div class="field"><label for="sl-date">Nit del dia</label><input type="date" id="sl-date"></div>
    <div class="field"><label for="sl-q">Com he dormit?</label><select id="sl-q"><option value="1">1 · Molt malament</option><option value="2">2 · Malament</option><option value="3" selected>3 · Regular</option><option value="4">4 · Bé</option><option value="5">5 · Molt bé</option></select></div>
    <div class="field"><label for="sl-bed">Hora d'anar al llit</label><input type="time" id="sl-bed" value="23:00"></div>
    <div class="field"><label for="sl-wake">Hora de llevar-me</label><input type="time" id="sl-wake" value="07:00"></div>
    <div class="field"><label for="sl-lat">Minuts fins a adormir-me</label><input type="text" id="sl-lat" inputmode="numeric" maxlength="3" value="15"></div>
    <div class="field"><label for="sl-awk">Minuts desperta a la nit</label><input type="text" id="sl-awk" inputmode="numeric" maxlength="3" value="0"></div>
  </div>
  <fieldset class="field" style="border:0;padding:0"><legend class="lbl">Ahir…</legend>
    <div class="chk-grid">
      <label class="chk"><input type="checkbox" name="slflag" value="0"> Cafeïna a la tarda o nit</label>
      <label class="chk"><input type="checkbox" name="slflag" value="1"> Alcohol</label>
      <label class="chk"><input type="checkbox" name="slflag" value="2"> Pantalla al llit</label>
      <label class="chk"><input type="checkbox" name="slflag" value="3"> Migdiada llarga</label>
      <label class="chk"><input type="checkbox" name="slflag" value="4"> Exercici durant el dia</label>
    </div></fieldset>
  <div class="field"><label for="sl-note">Nota (opcional)</label><input type="text" id="sl-note" maxlength="200" placeholder="Estrès, dolor, pensaments..."></div>
  <button class="btn btn-primary btn-sm" id="sl-save">Desar</button>
  <div class="spark" id="sl-spark" aria-hidden="true"></div>
  <p class="muted" id="sl-sum" aria-live="polite"></p>
  <ul class="log" id="sl-list"></ul>
  <div class="btn-row"><button class="btn btn-outline btn-sm" id="sl-clear">Esborrar diari</button></div>
  <div class="notice soft" style="margin-top:18px"><strong>Higiene del son</strong>Horari regular (també el cap de setmana) · llum del dia al matí · menys cafeïna a partir del migdia · sense alcohol per dormir · pantalles fora del llit · si no dorms en uns 20 minuts, aixeca't i fes alguna cosa tranquil·la fins que tinguis son. El llit és per dormir. Per a l'insomni persistent, la TCC-I és el tractament recomanat: <a href="trastorns/insomni.html">llegeix la fitxa</a>.</div>
</div>

<div class="tool" id="panic">
  <h2>💨 Registre de pànic</h2>
  <div class="notice warn" role="note"><strong>Durant un atac de pànic</strong>Els símptomes són molt desagradables però <strong>no són perillosos</strong> i passen: solen arribar al màxim en uns 10 minuts. Expira lent (4 segons inspirar, 6 expirar), deixa que la sensació passi sense lluitar-hi i recorda't: «és pànic, passarà». Si és la primera vegada o tens dolor al pit que no passa, truca al 112.</div>
  <p class="muted" style="margin-top:14px">Anota'l després, quan ja estiguis més calmat/da. Veure el patró ajuda a perdre la por.</p>
  <div class="field"><label for="pa-int">Intensitat màxima: <output id="pa-oint">60</output>/100</label><input type="range" id="pa-int" min="0" max="100" step="5" value="60" style="width:100%"></div>
  <div class="field"><label for="pa-min">Durada aproximada (minuts)</label><input type="text" id="pa-min" inputmode="numeric" maxlength="3" placeholder="Ex.: 10"></div>
  <fieldset class="field" style="border:0;padding:0"><legend class="lbl">Símptomes</legend>
    <div class="chk-grid">
      <label class="chk"><input type="checkbox" name="pasym" value="0"> Palpitacions</label>
      <label class="chk"><input type="checkbox" name="pasym" value="1"> Ofec o pressió al pit</label>
      <label class="chk"><input type="checkbox" name="pasym" value="2"> Sudoració</label>
      <label class="chk"><input type="checkbox" name="pasym" value="3"> Tremolors</label>
      <label class="chk"><input type="checkbox" name="pasym" value="4"> Marejos</label>
      <label class="chk"><input type="checkbox" name="pasym" value="5"> Formigueig</label>
      <label class="chk"><input type="checkbox" name="pasym" value="6"> Nàusees</label>
      <label class="chk"><input type="checkbox" name="pasym" value="7"> Sensació d'irrealitat</label>
      <label class="chk"><input type="checkbox" name="pasym" value="8"> Por de perdre el control</label>
      <label class="chk"><input type="checkbox" name="pasym" value="9"> Por de morir</label>
    </div></fieldset>
  <div class="field"><label for="pa-ctx">On era i què passava?</label><input type="text" id="pa-ctx" maxlength="200" placeholder="Ex.: al metro, molt ple"></div>
  <div class="field"><label for="pa-fear">Què temia que passaria?</label><input type="text" id="pa-fear" maxlength="200" placeholder="Ex.: que m'ofegués o em desmaiés"></div>
  <div class="field"><label for="pa-did">Què vaig fer (i va passar?)</label><input type="text" id="pa-did" maxlength="200" placeholder="Ex.: vaig sortir; després va baixar"></div>
  <button class="btn btn-primary btn-sm" id="pa-save">Desar</button>
  <p class="muted" id="pa-sum" aria-live="polite" style="margin-top:14px"></p>
  <ul class="log" id="pa-list"></ul>
  <div class="btn-row"><button class="btn btn-outline btn-sm" id="pa-clear">Esborrar registre</button></div>
  <div class="notice soft" style="margin-top:18px"><strong>Per saber-ne més</strong>Llegeix la fitxa de <a href="trastorns/trastorn-de-panic.html">trastorn de pànic</a> i prova la <a href="eines.html#respiracio">respiració guiada</a>.</div>
</div>

<div class="notice soft"><strong>Porta-ho a la consulta</strong>Pots <a href="meves-dades.html">imprimir o descarregar</a> aquests registres per ensenyar-los al teu metge o psicòleg.</div>
</div></section>"""
write("eines-tcc.html", with_scripts(page("eines-tcc.html", f"Eines de TCC: activació conductual, son i pànic | {NAME}", "Activació conductual per a la depressió, diari de son i registre de pànic. Eines de TCC que es guarden només al teu dispositiu.", body, "eines.html"), ["js/tcc.js"]))

# ---------- Guia: com parlar-ne ----------
body = """
<section class="page-hero"><div class="container narrow">
  <span class="eyebrow">Guia pràctica</span><h1>Com parlar-ne</h1>
  <p class="lead muted">Posar paraules al que et passa és un pas gran. Aquí tens idees i frases per començar amb la família, amb el teu metge de capçalera i a la feina.</p>
  <div class="notice soft"><strong>No cal fer-ho perfecte</strong>No necessites tenir-ho tot clar ni les paraules exactes. Pots començar només dient «no m'estic trobant bé».</div>
  <div class="btn-row"><a class="btn btn-outline btn-sm" href="#familia">Amb la família i amics</a><a class="btn btn-outline btn-sm" href="#metge">Amb el metge</a><a class="btn btn-outline btn-sm" href="#feina">A la feina</a></div>
</div></section>
<section style="padding-top:10px"><div class="container narrow article" data-read>

<h2 id="familia">Amb un familiar o amic</h2>
<h3>Abans de començar</h3>
<ul><li>Tria una persona en qui confiïs, no necessàriament la primera que et vingui al cap.</li><li>Busca un moment tranquil, sense presses ni distraccions. Pot ser caminant o per missatge, si et costa de cara a cara.</li><li>Decideix què vols demanar: <em>escolta</em>, <em>companyia</em>, <em>ajuda a buscar un professional</em>…</li></ul>
<h3>Frases per començar</h3>
<ul>
<li>«Últimament no em trobo bé i volia explicar-t'ho. No necessito que ho arreglis, només que m'escoltis.»</li>
<li>«Fa temps que em costa dormir i tinc molta angoixa. M'agradaria demanar ajuda i m'aniria bé que m'acompanyessis.»</li>
<li>«No sé ben bé què em passa, però no sóc jo. Em pots ajudar a trobar a qui puc preguntar?»</li>
</ul>
<h3>Si la reacció no és la que esperaves</h3>
<p>De vegades la gent minimitza («són coses teves») o s'espanta. Sovint no és manca d'afecte, sinó que no saben què dir. Pots dir-los: «Això em fa mal sentir-ho; el que m'ajuda és…». I recorda que pots provar amb una altra persona o anar directament a un professional.</p>

<h2 id="metge">Amb el metge de capçalera (CAP)</h2>
<p>El metge de família és la porta d'entrada habitual al sistema públic. Té poc temps, així que preparar-te ajuda molt.</p>
<h3>Què portar</h3>
<ul><li>Una llista de <strong>què sents</strong>, <strong>des de quan</strong> i <strong>com t'afecta</strong> (son, feina, relacions, gana).</li><li>Els medicaments o suplements que prens.</li><li>Antecedents a la família, si en saps.</li><li>Els registres d'aquesta web (ànim, son, pànic…): pots <a href="meves-dades.html">imprimir-los o descarregar-los</a>.</li></ul>
<h3>Com començar la visita</h3>
<p>Digues el motiu principal de seguida, en una frase. Per exemple:</p>
<ul><li>«Fa unes setmanes que em sento molt trist i sense forces, i em costa anar a treballar.»</li><li>«Tinc atacs de pànic i cada vegada evito més coses.»</li><li>«Dormo molt poc des de fa mesos i estic esgotat/da.»</li></ul>
<div class="notice warn"><strong>Si penses en fer-te mal</strong>Digues-ho en veu alta. Ho tractaran com una prioritat i no et jutjaran. Si és urgent, truca al <a href="tel:024">024</a> o al <a href="tel:112">112</a>.</div>
<h3>Què pot passar</h3>
<ul><li>Et faran preguntes sobre els símptomes i, de vegades, algun qüestionari breu.</li><li>Pot demanar-te una analítica per descartar causes físiques (per exemple, tiroides o anèmia).</li><li>Pot proposar-te seguiment, tractament o derivar-te a un psicòleg o a un centre de salut mental (CSMA).</li></ul>
<h3>Preguntes útils</h3>
<ul><li>«Quines opcions tinc? Quins avantatges i inconvenients té cadascuna?»</li><li>«Quant de temps trigaré a notar millora?»</li><li>«Quan ens tornem a veure?»</li><li>«Si empitjoro, què faig o a qui truco?»</li></ul>
<p class="muted">Pots anar acompanyat/da. Si no et sents escoltat/da, tens dret a demanar una altra visita o una segona opinió.</p>

<h2 id="feina">A la feina</h2>
<p>Decidir si ho expliques i a qui és una decisió teva. <strong>No tens l'obligació de comunicar el teu diagnòstic a l'empresa.</strong></p>
<h3>Si necessites una baixa mèdica</h3>
<ul><li>La baixa la gestiona el teu metge. El comunicat de baixa que arriba a l'empresa no inclou el diagnòstic.</li><li>Pots dir simplement: «El meu metge m'ha donat la baixa per motius de salut».</li></ul>
<h3>Si vols continuar treballant amb ajustos</h3>
<p>Pots demanar canvis raonables: flexibilitat d'horari, teletreball algun dia, repartir tasques, pauses, o reduir una càrrega temporal. Alguns exemples de frases:</p>
<ul><li>«Estic passant per un moment difícil de salut i voldria parlar d'alguns ajustos temporals perquè pugui continuar amb la feina.»</li><li>«M'aniria bé tenir un horari més regular durant unes setmanes.»</li></ul>
<h3>Amb qui parlar</h3>
<ul><li>El teu responsable directe o recursos humans, si hi ha confiança.</li><li>El servei de prevenció de riscos laborals de l'empresa, que té deure de confidencialitat.</li><li>Els delegats sindicals o de prevenció, si en tens.</li><li>Si el malestar ve de la feina (assetjament, sobrecàrrega, discriminació), anota dates i fets i demana assessorament.</li></ul>
<div class="notice soft"><strong>Importa la teva salut</strong>Cuidar-te no és fallar a la feina. Si no pots més, parlar-ne amb un professional és el primer pas.</div>

<div class="btn-row"><a class="btn btn-primary" href="ajuda.html">Trobar ajuda</a><a class="btn btn-outline" href="familiars.html">Per a familiars</a></div>
</div></section>"""
body = add_review(body)
write("parlar-ne.html", with_scripts(page("parlar-ne.html", f"Com parlar-ne: família, metge i feina | {NAME}", "Guia pràctica amb frases i consells per parlar de salut mental amb la família, el metge de capçalera i a la feina.", body, "parlar-ne.html")))

# ---------- Joves ----------
body = """
<section class="page-hero"><div class="container narrow">
  <span class="eyebrow">Per a joves</span><h1>No estàs sol/a en això</h1>
  <p class="lead muted">Estudis, amics, xarxes, família, saber qui ets… Sentir-se malament de tant en tant és humà. Aquí tens informació clara per entendre't i saber a qui demanar ajuda.</p>
  <div class="notice warn" role="alert"><strong>Si ara et vols fer mal o tens por per la teva vida</strong>Truca ja al <a href="tel:900202010">900 20 20 10 (ANAR, gratuït)</a>, al <a href="tel:024">024</a> o al <a href="tel:112">112</a>. També pots dir-ho a un adult de confiança. Ara mateix.</div>
</div></section>
<section style="padding-top:10px"><div class="container narrow article" data-read>

<h2>Què és normal i què no tant</h2>
<p>Tothom té dies de merda: un examen, una baralla, una decepció. Això passa. Val la pena demanar ajuda quan, durant <strong>més de dues setmanes</strong>, passa alguna d'aquestes coses:</p>
<ul>
<li>Et sents trist/a, buit/da o irritable gairebé cada dia.</li>
<li>Has perdut l'interès per coses que abans t'agradaven.</li>
<li>Dorms molt més o molt menys del normal, o t'has quedat sense gana (o menges per compulsió).</li>
<li>Et costa concentrar-te i les notes o la feina baixen.</li>
<li>Evites els amics o sortir de casa, o tens por intensa a situacions socials.</li>
<li>Tens atacs d'angoixa o de pànic.</li>
<li>Et fas mal a tu mateix/a, o penses que seria millor no ser aquí.</li>
</ul>
<p>Si et reconeixes, no vol dir que «estiguis boig/a». Vol dir que potser et mereixes suport.</p>

<h2>Com ho pots dir a algú</h2>
<p>Costa, però és un pas molt valent. Pots començar per:</p>
<ul>
<li>Un/a <strong>adult de confiança</strong>: pare, mare, tutors, un/a professor/a, tutor/a de l'institut, un/a entrenador/a, un/a familiar.</li>
<li>El teu <strong>pediatre o metge de capçalera</strong> (al CAP). Pots demanar visita pel que sents.</li>
<li>Al centre educatiu: el tutor/a o l'orientador/a / psicopedagog/a poden ajudar.</li>
<li>El <a href="tel:900202010">900 20 20 10 (ANAR)</a> és gratuït i confidencial, per a menors fins a 18 anys.</li>
</ul>
<p>Pots dir: <em>«M'estic trobant malament fa temps i no sé què fer. Em pots ajudar?»</em>. Amb això n'hi ha prou. Més idees a la <a href="parlar-ne.html">guia «Com parlar-ne»</a>.</p>

<h2>Coses que et poden ajudar des d'avui</h2>
<ul>
<li><strong>Dormir:</strong> horaris regulars i mòbil fora del llit. El son canvia molt l'ànim. <a href="eines-tcc.html#son">Diari de son</a></li>
<li><strong>Moure't:</strong> una volta, ballar, esport. Una mica cada dia val més que molt un sol dia.</li>
<li><strong>Respirar i parar:</strong> <a href="eines.html#respiracio">respiració guiada</a> o el <a href="eines.html#grounding">5-4-3-2-1</a> quan l'angoixa puja.</li>
<li><strong>Posar nom al que sents:</strong> el <a href="eines.html#anim">registre d'ànim</a> i el <a href="eines.html#pensaments">diari de pensaments</a>.</li>
<li><strong>No aïllar-te del tot:</strong> un missatge a un amic/ga ja és molt.</li>
</ul>

<h2>Xarxes, pantalles i pressió</h2>
<ul>
<li>El que veus a les xarxes és una selecció. No et comparis amb la «vida perfecta» dels altres.</li>
<li>Si una xarxa o un compte et fa sentir pitjor, pots silenciar-lo, deixar de seguir-lo o fer una pausa.</li>
<li>Si algú t'assetja, t'amenaça o difon fotos teves, no és culpa teva. Guarda captures, bloqueja i explica-ho a un adult. Pots trucar a l'ANAR (900 20 20 10).</li>
</ul>

<h2>Si ets amic o amiga d'algú que ho passa malament</h2>
<ul>
<li>Escolta sense jutjar i sense minimitzar («no és per tant»).</li>
<li>Pregunta directament i amb calma com està. Preguntar no empitjora res.</li>
<li><strong>No guardis en secret</strong> que algú vol fer-se mal: explica-ho a un adult. No és trair-lo: és cuidar-lo.</li>
<li>Si hi ha perill immediat, no el deixis sol/a i truca al 112.</li>
</ul>

<h2>Telèfons</h2>
<div class="res"><div><h3>ANAR</h3><p>Ajuda gratuïta i confidencial per a menors fins als 18 anys, 24 h.</p></div><a class="num blue" href="tel:900202010">900 20 20 10</a></div>
<div class="res"><div><h3>Prevenció del suïcidi</h3><p>Gratuït, 24 h, per a qualsevol edat.</p></div><a class="num" href="tel:024">024</a></div>
<div class="res"><div><h3>Emergències</h3><p>Si hi ha perill immediat.</p></div><a class="num" href="tel:112">112</a></div>

<div class="notice soft"><strong>Això no et defineix</strong>Passar-ho malament no et fa dèbil ni menys important. I amb ajuda, la majoria de les persones milloren.</div>
<div class="btn-row"><a class="btn btn-primary" href="ajuda.html">Més recursos</a><a class="btn btn-outline" href="trastorns.html">Entendre el que sento</a></div>
</div></section>"""
body = add_review(body)
write("joves.html", with_scripts(page("joves.html", f"Salut mental per a joves | {NAME}", "Informació clara i en llenguatge proper per a adolescents i joves: com saber si necessites ajuda, com dir-ho i on trucar.", body, "joves.html")))

# ---------- Les meves dades: exportar, còpia, recordatoris ----------
body = """
<section class="page-hero"><div class="container narrow">
  <p class="crumbs no-print"><a href="eines.html">← Eines</a></p>
  <span class="eyebrow">Les teves dades</span><h1>Les meves dades i recordatoris</h1>
  <p class="lead muted no-print">Tot el que apuntes a les eines es guarda només al teu navegador. Aquí pots imprimir-ho, fer-ne una còpia o preparar recordatoris per a l'agenda.</p>
</div></section>
<section style="padding-top:10px"><div class="container narrow">

<div class="tool no-print" id="resum">
  <h2>📦 Què tens guardat</h2>
  <ul class="log" id="d-count"></ul>
  <p class="muted" style="font-size:.9rem">Les dades viuen només en aquest navegador i dispositiu. Si esborres les dades del navegador, es perdran: per això convé fer una còpia.</p>
</div>

<div class="tool" id="imprimir">
  <h2>🖨️ Per portar a la consulta</h2>
  <p class="muted no-print">Genera un resum llegible per ensenyar al teu metge o psicòleg. Pots imprimir-lo, desar-lo com a PDF o descarregar-lo com a text.</p>
  <fieldset class="field no-print" style="border:0;padding:0"><legend class="lbl">Què hi vols incloure?</legend>
    <div class="chk-grid" id="d-pick"></div></fieldset>
  <div class="btn-row no-print"><button class="btn btn-primary btn-sm" id="d-view">Mostrar el resum</button><button class="btn btn-outline btn-sm" id="d-print">Imprimir o desar com a PDF</button><button class="btn btn-outline btn-sm" id="d-txt">Descarregar (.txt)</button></div>
  <div id="d-out" class="report" hidden></div>
</div>

<div class="tool no-print" id="copia">
  <h2>💾 Còpia de seguretat</h2>
  <p class="muted">Descarrega un fitxer amb totes les teves dades, o recupera'n un d'abans (per exemple en un altre dispositiu).</p>
  <div class="btn-row"><button class="btn btn-primary btn-sm" id="d-export">Descarregar còpia (.json)</button></div>
  <div class="field" style="margin-top:18px"><label for="d-file">Importar una còpia</label><input type="file" id="d-file" accept=".json,application/json"></div>
  <fieldset class="field" style="border:0;padding:0"><legend class="lbl">En importar…</legend>
    <label class="chk"><input type="radio" name="d-mode" value="merge" checked> <span>Afegir al que ja tinc (sense duplicar)</span></label>
    <label class="chk" style="margin-top:6px"><input type="radio" name="d-mode" value="replace"> <span>Substituir el que tinc</span></label></fieldset>
  <button class="btn btn-outline btn-sm" id="d-import" disabled>Importar</button>
  <p id="d-msg" class="muted" aria-live="polite" style="margin-top:12px"></p>
</div>

<div class="tool no-print" id="recordatoris">
  <h2>⏰ Recordatoris suaus per a l'agenda</h2>
  <p class="muted">Aquesta web no envia notificacions. Pots descarregar un fitxer de calendari (.ics) i obrir-lo amb el teu calendari (Google, Apple, Outlook…) perquè t'ho recordi ell.</p>
  <div class="grid grid-2">
    <div class="field"><label for="r-what">Recordatori</label>
      <select id="r-what">
        <option value="pla">El meu pla</option>
        <option value="anim">Registre d'ànim</option>
        <option value="resp">Respiració guiada</option>
        <option value="son">Diari de son</option>
        <option value="activitat">Activitat planificada (activació conductual)</option>
        <option value="pensaments">Diari de pensaments</option>
        <option value="exposicio">Pas d'exposició (ansietat social)</option>
      </select></div>
    <div class="field"><label for="r-time">Hora</label><input type="time" id="r-time" value="21:00"></div>
    <div class="field"><label for="r-freq">Freqüència</label>
      <select id="r-freq"><option value="daily">Cada dia</option><option value="weekdays">De dilluns a divendres</option><option value="weekly">Un cop a la setmana</option></select></div>
    <div class="field"><label for="r-weeks">Durant quantes setmanes</label>
      <select id="r-weeks"><option value="2">2</option><option value="4" selected>4</option><option value="8">8</option><option value="12">12</option></select></div>
  </div>
  <button class="btn btn-primary btn-sm" id="r-make">Descarregar recordatori (.ics)</button>
  <p class="muted" style="font-size:.9rem;margin-top:12px">El fitxer només conté un títol amable i un enllaç a aquesta web, mai les teves dades.</p>
</div>

<div class="tool no-print" id="esborrar">
  <h2>🗑️ Esborrar-ho tot</h2>
  <p class="muted">Elimina de manera definitiva totes les dades de les eines d'aquest navegador. No es pot desfer.</p>
  <button class="btn btn-outline btn-sm" id="d-wipe">Esborrar totes les dades</button>
</div>

</div></section>"""
write("meves-dades.html", with_scripts(page("meves-dades.html", f"Les meves dades: imprimir, còpia i recordatoris | {NAME}", "Imprimeix o descarrega els registres de les eines, fes-ne una còpia de seguretat i crea recordatoris per a l'agenda. Tot al teu dispositiu.", body, "eines.html"), ["js/plan-cat.js", "js/dades.js"]))

# ---------- Assistent IA (experimental) ----------
body = """
<section class="page-hero"><div class="container narrow">
  <p class="crumbs"><a href="ansietat-social-eines.html">← Eines d'ansietat social</a></p>
  <span class="eyebrow">Experimental · opcional</span><h1>Assistent de TCC amb IA</h1>
  <p class="lead muted">Practica converses socials, reformula pensaments i prepara experiments conductuals amb un model d'IA que s'executa al teu dispositiu.</p>
  <div class="notice warn"><strong>No és un terapeuta</strong>És una IA experimental i pot equivocar-se, sobretot en català. No diagnostica ni substitueix un professional. Si estàs en crisi, truca al <a href="tel:024">024</a> o al <a href="tel:112">112</a>.</div>
</div></section>
<section style="padding-top:10px"><div class="container narrow">

<div class="tool" id="a-setup">
  <h2>1. Activa l'assistent</h2>
  <p class="muted">No es descarrega res fins que ho demanis. Les converses <strong>no es desen ni s'envien enlloc</strong>: es queden a la pantalla i desapareixen en tancar la pàgina.</p>
  <fieldset class="field" style="border:0;padding:0"><legend class="lbl">On vols que s'executi?</legend>
    <label class="chk"><input type="radio" name="engine" value="web" checked> <span><strong>Al navegador</strong> (recomanat): privat i sense instal·lar res. Cal Chrome o Edge d'escriptori recents (WebGPU).</span></label>
    <label class="chk" style="margin-top:8px"><input type="radio" name="engine" value="ollama"> <span><strong>Ollama local</strong>: si ja el tens instal·lat al teu ordinador. Permet models millors.</span></label>
  </fieldset>

  <div class="field"><label for="a-lang">Idioma de la conversa</label>
    <select id="a-lang"><option value="es" selected>Español</option><option value="en">English</option><option value="ca">Català</option></select></div>
  <div class="notice soft" id="a-lang-note"><strong>Per motius tècnics, és millor parlar en castellà</strong>Els models d'IA petits que s'executen al dispositiu entenen i escriuen força millor en castellà que en català, on solen cometre errors o perdre el fil. Per això l'assistent conversa per defecte en castellà. La resta de la web continua en català.</div>

  <div id="a-web-box">
    <div class="field"><label for="a-model">Model</label>
      <select id="a-model">
        <option value="Llama-3.2-3B-Instruct-q4f16_1-MLC">Llama 3.2 · 3B (~2,3 GB) · recomanat, més pesat</option>
        <option value="gemma-2-2b-it-q4f16_1-MLC">Gemma 2 · 2B (~1,5 GB) · equilibrat</option>
        <option value="Llama-3.2-1B-Instruct-q4f16_1-MLC">Llama 3.2 · 1B (~0,9 GB) · lleuger, més limitat</option>
      </select></div>
    <p class="muted" style="font-size:.9rem">En activar-lo es baixarà la llibreria de <strong>jsDelivr</strong> i el model de <strong>Hugging Face</strong> (serveis de tercers, que poden registrar la teva IP). Es guarda a la memòria cau del navegador.</p>
  </div>

  <div id="a-oll-box" hidden>
    <p class="muted" style="font-size:.9rem">Arrenca Ollama permetent aquesta web i descarrega un model. Al terminal:</p>
    <pre class="code">OLLAMA_ORIGINS=https://francescsolsonatehas.github.io ollama serve
ollama pull llama3.2</pre>
    <button class="btn btn-outline btn-sm" id="a-oll-check" type="button">Detectar Ollama</button>
    <div class="field" id="a-oll-sel" hidden style="margin-top:12px"><label for="a-oll-model">Model d'Ollama</label><select id="a-oll-model"></select></div>
    <p class="muted" style="font-size:.9rem;margin-top:10px">La web només parlarà amb el teu Ollama a <code>localhost</code>; res no surt del teu ordinador. Alguns navegadors (p. ex. Safari) bloquegen aquesta connexió des d'una web https.</p>
  </div>

  <label class="chk" style="margin:16px 0"><input type="checkbox" id="a-consent"> <span>Entenc que és una IA experimental, no un terapeuta, i que pot dir coses incorrectes. Accepto la descàrrega descrita.</span></label>
  <button class="btn btn-primary" id="a-load" disabled>Activar l'assistent</button>
  <div class="progress" id="a-progress" hidden><i id="a-bar"></i></div>
  <p id="a-status" class="muted" aria-live="polite"></p>
</div>

<div id="a-chat" hidden>
  <div class="tool">
    <h2>2. Tria què vols fer</h2>
    <div class="field"><label for="a-mode">Mode</label>
      <select id="a-mode">
        <option value="roleplay">Practicar una conversa social</option>
        <option value="reformula">Reformular un pensament (preguntes socràtiques)</option>
        <option value="experiment">Preparar un experiment conductual</option>
      </select></div>
    <div id="a-role-opts" class="grid grid-2">
      <div class="field"><label for="a-scenario">Escena</label>
        <select id="a-scenario"><option value="feina">Company de feina (cafè)</option><option value="veí">Veí (ascensor)</option><option value="botiga">Dependent/a de botiga</option><option value="desconegut">Desconegut a la parada</option><option value="reunio">Abans d'una reunió</option><option value="entrevista">Entrevista de feina</option></select></div>
      <div class="field"><label for="a-level">Dificultat</label>
        <select id="a-level"><option value="facil">Fàcil</option><option value="mitja">Mitjana</option><option value="dificil">Difícil</option></select></div>
    </div>
    <div class="btn-row"><button class="btn btn-primary btn-sm" id="a-start">Començar</button><button class="btn btn-outline btn-sm" id="a-reset" type="button">Netejar</button></div>
  </div>

  <div class="tool">
    <div class="chat-log" id="a-log" role="log" aria-live="polite" aria-label="Conversa"></div>
    <div class="notice warn" id="a-crisis" role="alert" hidden><strong>Gràcies per dir-ho. Importa com et sents.</strong>Aquesta eina no et pot ajudar en això, però hi ha persones que sí: truca ara al <a href="tel:024"><b>024</b></a> (gratuït, 24 h) o al <a href="tel:112"><b>112</b></a> si hi ha perill immediat. Si pots, no et quedis sol/a. <a href="ajuda.html">Més recursos</a></div>
    <form id="a-form" class="chat-form">
      <label for="a-input" class="sr-only" style="position:absolute;left:-999px">El teu missatge</label>
      <input type="text" id="a-input" maxlength="500" autocomplete="off" placeholder="Escriu aquí...">
      <button class="btn btn-primary btn-sm" id="a-send" type="submit">Enviar</button>
      <button class="btn btn-outline btn-sm" id="a-stop" type="button" hidden>Aturar</button>
    </form>
    <div class="btn-row"><button class="btn btn-outline btn-sm" id="a-end" type="button">Acabar i demanar feedback</button></div>
  </div>
</div>

<div class="notice soft"><strong>Millor amb un professional</strong>Aquest assistent és un complement per practicar. La TCC funciona millor acompanyada d'un psicòleg. <a href="ajuda.html">Trobar ajuda</a></div>
</div></section>"""
write("ansietat-social-assistent.html", with_scripts(page("ansietat-social-assistent.html", f"Assistent de TCC amb IA per a l'ansietat social | {NAME}", "Assistent experimental d'IA que s'executa al teu dispositiu per practicar converses socials i reformular pensaments amb TCC.", body, "eines.html"), ["module:js/assistent.js"]))

# ---------- Cribratges ----------
body = '''
<section class="page-hero"><div class="container narrow">
  <span class="eyebrow">Orientatiu</span><h1>Cribratges: PHQ-9 i GAD-7</h1>
  <p class="lead muted">Qüestionaris breus que mesuren símptomes de depressió i d'ansietat de les últimes dues setmanes.</p>
  <div class="notice warn"><strong>No és un diagnòstic</strong>Els resultats no substitueixen una valoració clínica. Les respostes no s'envien enlloc: es calculen al teu dispositiu.</div>
</div></section>
<section style="padding-top:10px"><div class="container narrow">
  <div class="filters" role="group" aria-label="Escull el qüestionari">
    <button class="chip" id="tab-phq" aria-pressed="true">PHQ-9 · Ànim</button>
    <button class="chip" id="tab-gad" aria-pressed="false">GAD-7 · Ansietat</button>
  </div>
  <p class="muted" id="s-intro"></p>
  <form id="s-form" novalidate></form>
  <div class="btn-row"><button class="btn btn-primary" id="s-calc">Veure resultat</button><button class="btn btn-outline" id="s-reset" type="button">Esborrar respostes</button></div>
  <div class="result" id="s-result" aria-live="polite"></div>
  <p class="muted" style="margin-top:28px;font-size:.88rem">Els ítems són una adaptació al català de les escales PHQ-9 i GAD-7 (Pfizer Inc., d'ús lliure). Han de ser interpretats per un professional.</p>
</div></section>'''
write("cribratges.html", with_scripts(page("cribratges.html", f"Cribratges PHQ-9 i GAD-7 en català | {NAME}", "Qüestionaris orientatius sobre símptomes de depressió i ansietat, amb recomanacions i derivació a professionals.", body, "cribratges.html"), ["js/cribratges.js"]))

# ---------- Ajuda ----------
def res(t, d, num, href, blue=False):
    return f'<div class="res"><div><h3>{t}</h3><p>{d}</p></div><a class="num{" blue" if blue else ""}" href="{href}">{num}</a></div>'

body = f'''
<section class="page-hero"><div class="container narrow">
  <span class="eyebrow">Recursos</span><h1>Trobar ajuda</h1>
  <p class="lead muted">Telèfons i serveis per a diferents moments. Si dubtes, truca: ningú no et jutjarà.</p>
</div></section>
<section style="padding-top:10px"><div class="container narrow">
  <div class="notice warn" id="urgent" role="alert"><strong>Urgent: perill per a tu o per a algú altre</strong>No esperis. Truca ara.</div>
  <h2 style="margin-top:1.2em">Telèfons d'ajuda</h2>
  {res("Emergències", "Risc immediat per a la vida o la integritat.", "112", "tel:112")}
  {res("Línia de prevenció de la conducta suïcida", "Gratuïta, confidencial i oberta 24 h tots els dies. Per a qui pensa a fer-se mal i per a familiars.", "024", "tel:024")}
  {res("ANAR – infants i adolescents", "Ajuda confidencial i gratuïta per a menors fins als 18 anys, 24 h. També al 116 111. Familiars i centres escolars: 600 50 51 52.", "900 20 20 10", "tel:900202010", True)}
  {res("Salut Respon (Catalunya)", "Atenció sanitària telefònica 24 h; orienta cap als serveis de salut.", "061", "tel:061", True)}
  {res("Telèfon de l'Esperança", "Suport emocional per escoltar i acompanyar (Barcelona).", "93 414 48 48", "tel:934144848", True)}

  <h2 style="margin-top:2em">Atenció sanitària pública a Catalunya</h2>
  <ul>
    <li><strong>CAP (Centre d'Atenció Primària):</strong> el metge de família és el primer pas. Pot valorar, orientar i derivar a salut mental.</li>
    <li><strong>CSMA / CSMIJ:</strong> Centres de Salut Mental d'Adults i d'Infants i Juvenil. S'hi accedeix normalment per derivació.</li>
    <li><strong>CAS:</strong> Centres d'Atenció i Seguiment a les drogodependències.</li>
    <li><strong>Urgències hospitalàries:</strong> si hi ha risc greu i immediat.</li>
  </ul>
  <h2>Atenció privada i associacions</h2>
  <ul>
    <li><a href="https://www.copc.cat" rel="noopener">Col·legi Oficial de Psicologia de Catalunya</a>: pots comprovar que un psicòleg està col·legiat.</li>
    <li><a href="https://www.salutmental.org" rel="noopener">Salut Mental Catalunya</a>: federació d'associacions de persones amb problemes de salut mental i famílies.</li>
    <li><a href="https://canalsalut.gencat.cat" rel="noopener">Canal Salut</a>: portal oficial de la Generalitat.</li>
  </ul>
  <div class="notice soft"><strong>Fora de Catalunya</strong>A la resta d'Espanya, el 024 és gratuït i funciona a tot l'Estat. Fora d'Espanya, consulta el servei d'emergències local.</div>
  <p class="muted" style="font-size:.88rem">Els telèfons i serveis poden canviar. Comprova'ls en les webs oficials abans de dependre d'un número.</p>
</div></section>'''
write("ajuda.html", with_scripts(page("ajuda.html", f"Trobar ajuda: telèfons i serveis de salut mental | {NAME}", "Telèfons d'emergència i recursos de salut mental a Catalunya: 112, 024, CAP, CSMA i associacions.", body, "ajuda.html")))

# ---------- Familiars ----------
body = '''
<section class="page-hero"><div class="container narrow">
  <span class="eyebrow">Per a qui acompanya</span><h1>Per a familiars i cuidadors</h1>
  <p class="lead muted">Acompanyar algú amb sofriment psicològic no és fàcil. També tu mereixes suport.</p>
</div></section>
<section style="padding-top:10px"><div class="container narrow article" data-read>
  <h2>Què pots dir</h2>
  <ul><li>«Estic aquí i t'escolto.»</li><li>«Ho deu estar sent molt difícil. Gràcies per explicar-m'ho.»</li><li>«No ets una càrrega per a mi.»</li><li>«Vols que busquem ajuda junts?»</li></ul>
  <h2>Què és millor evitar</h2>
  <ul><li>«Anima't», «no és per tant», «has de ser fort/a».</li><li>Comparar el seu sofriment amb el d'altres.</li><li>Jutjar, culpar o fer bromes sobre el seu estat.</li><li>Prometre guardar secrets si hi ha risc per a la seva vida.</li></ul>
  <h2>Com ajudar en la pràctica</h2>
  <ul><li>Ofereix-te a acompanyar-lo a la primera visita al metge o psicòleg.</li><li>Ajuda amb rutines bàsiques: dormir, menjar, sortir a caminar.</li><li>Respecta el seu ritme: de vegades l'ajuda és només estar-hi present.</li><li>Informa't amb les <a href="trastorns.html">fitxes de trastorns</a>.</li></ul>
  <div class="notice warn"><strong>Si sospites que pensa a fer-se mal</strong>Pregunta-li directament i amb calma. Preguntar no augmenta el risc. Si hi ha perill immediat, no el deixis sol/a i truca al <a href="tel:112">112</a>. Per orientació, el <a href="tel:024">024</a> també atén familiars.</div>
  <h2>I tu, com estàs?</h2>
  <p>Cuidar també desgasta. Busca espais propis, parla amb algú de confiança i considera associacions de familiars, on hi ha persones que han passat per situacions semblants.</p>
  <div class="btn-row"><a class="btn btn-primary" href="ajuda.html">Recursos d'ajuda</a></div>
</div></section>'''
body = add_review(body)
write("familiars.html", with_scripts(page("familiars.html", f"Per a familiars i cuidadors | {NAME}", "Com acompanyar una persona amb sofriment psicològic: què dir, què evitar i com cuidar-se.", body, "familiars.html")))

# ---------- Legals ----------
body = '''
<section class="page-hero"><div class="container narrow"><h1>Avís legal i mèdic</h1></div></section>
<section style="padding-top:10px"><div class="container narrow article" data-read>
  <h2>Avís mèdic</h2>
  <p>Aquest lloc web té una finalitat exclusivament informativa i educativa. <strong>No ofereix diagnòstic, tractament ni assessorament mèdic o psicològic personalitzat</strong> i no substitueix la consulta amb un professional sanitari qualificat. Mai ignoris el consell d'un professional ni abandonis un tractament per allò que has llegit aquí.</p>
  <p>En cas d'emergència, truca al 112. Si tens pensaments suïcides, truca al 024.</p>
  <h2>Cribratges</h2>
  <p>Els qüestionaris PHQ-9 i GAD-7 són eines orientatives. Un resultat no confirma ni descarta cap trastorn.</p>
  <h2>Contingut i responsabilitat</h2>
  <p>Es procura que el contingut sigui acurat i basat en fonts reconegudes, però es proporciona «tal com és», sense garanties. El titular no es fa responsable de les decisions preses a partir de la informació del web.</p>
  <h2>Propietat intel·lectual</h2>
  <p>Les tipografies Inter i Poppins es distribueixen sota la llicència SIL Open Font License 1.1.</p>
  <h2>Titular</h2>
  <p>[Completa aquí el nom o la raó social, el NIF i el correu de contacte del titular del web, segons exigeix la LSSI-CE.]</p>
</div></section>'''
write("avis-legal.html", with_scripts(page("avis-legal.html", f"Avís legal i mèdic | {NAME}", "Avís legal i mèdic del web de salut mental.", body)))

body = '''
<section class="page-hero"><div class="container narrow"><h1>Privacitat i cookies</h1></div></section>
<section style="padding-top:10px"><div class="container narrow article" data-read>
  <div class="notice soft"><strong>En resum</strong>Aquest web no recull dades personals, no té comptes d'usuari, no fa servir cookies ni analítica de tercers.</div>
  <h2>Dades que es guarden</h2>
  <p>Les eines (registre d'ànim, diari de pensaments, activació conductual, diari de son, registre de pànic, eines d'ansietat social i el pla personal) i les preferències (mode fosc, mida del text) es guarden <strong>únicament al teu navegador</strong> mitjançant el seu emmagatzematge local (localStorage). No s'envien a cap servidor. Pots esborrar-les en qualsevol moment des de les mateixes eines o esborrant les dades del lloc al navegador.</p>
  <p>Els resultats dels cribratges es calculen al teu dispositiu i no es desen.</p>
  <p>Les còpies de seguretat, els resums per imprimir i els recordatoris (.ics) es generen al teu navegador i es descarreguen al teu dispositiu; mai passen per cap servidor. Si comparteixes aquests fitxers, ets tu qui en decideix el destí.</p>
  <h2>Cookies i tercers</h2>
  <p>No s'utilitzen cookies. Les tipografies es serveixen des d'aquest mateix lloc, de manera que no es fan peticions a Google Fonts ni a altres tercers. L'allotjament es fa a GitHub Pages, que pot registrar dades tècniques de connexió (com l'adreça IP) segons la seva pròpia política de privacitat.</p>
  <h2>Assistent d'IA (opcional)</h2>
  <p>Només si actives l'assistent de la pàgina d'<a href="ansietat-social-assistent.html">ansietat social</a>, el teu navegador descarrega la llibreria WebLLM de <strong>jsDelivr</strong> i el model de <strong>Hugging Face</strong>; aquests serveis poden registrar dades tècniques com la IP. El model s'executa al teu dispositiu i les converses <strong>no s'envien ni es desen</strong>. Si tries Ollama, la web només es connecta a <code>localhost</code> al teu ordinador.</p>
  <h2>Drets (RGPD)</h2>
  <p>Com que no es tracten dades personals, no hi ha dades sobre les quals exercir drets. Si això canvia, s'actualitzarà aquesta pàgina.</p>
  <p class="muted">Dispositiu compartit? Esborra els registres des de l'apartat <a href="eines.html">Eines</a> quan hagis acabat.</p>
</div></section>'''
write("privacitat.html", with_scripts(page("privacitat.html", f"Privacitat i cookies | {NAME}", "Política de privacitat: sense comptes, sense cookies, dades només al teu navegador.", body)))

# ---------- El meu pla ----------
PLA_Q = ["Has dormit malament: t'ha costat adormir-te, t'has despertat sovint o massa d'hora?",
         "T'has sentit trist/a o sense ganes de fer coses que abans t'agradaven?",
         "T'has sentit nerviós/a, intranquil·l/a o amb preocupacions que no pots aturar?",
         "T'has sentit desbordat/da, amb massa coses a sobre (feina, estudis, casa)?",
         "T'has sentit sol/a o has evitat estar amb altra gent?"]
PLA_OPTS = ["Gens", "Alguns dies", "Més de la meitat dels dies", "Gairebé cada dia"]
PLA_SAFE = ["No", "Alguns dies", "Sovint"]


def radios(name, opts):
    return '<div class="opts">' + "".join(
        f'<label><input type="radio" name="{name}" value="{i}"> <span>{e(o)}</span></label>' for i, o in enumerate(opts)) + "</div>"


qs = "".join(f'<fieldset class="q"><legend>{i + 1}. {e(q)}</legend>{radios(f"q{i}", PLA_OPTS)}</fieldset>' for i, q in enumerate(PLA_Q))
body = f'''
<section class="page-hero"><div class="container narrow">
  <span class="eyebrow">Autoajuda</span><h1>El meu pla</h1>
  <p class="lead muted">Respon cinc preguntes sobre les últimes dues setmanes i rebràs una proposta de petits passos, amb enllaços a les eines d'aquest web. Pots canviar els passos que no t'encaixin.</p>
  <div class="notice"><strong>Una guia, no un diagnòstic</strong>El pla és orientatiu i no substitueix un professional. Les respostes i el pla es guarden només al teu navegador.</div>
</div></section>
<section style="padding-top:10px"><div class="container narrow">

<div class="tool" id="p-quiz">
  <h2>📝 Les últimes dues setmanes</h2>
  <p class="muted">Amb quina freqüència t'ha passat això durant les últimes dues setmanes? No hi ha respostes bones ni dolentes.</p>
  <form id="p-form" novalidate>
    {qs}
    <fieldset class="q"><legend>Opcional: has pensat que seria millor no ser aquí o has pensat a fer-te mal?</legend>{radios("s", PLA_SAFE)}</fieldset>
    <div class="btn-row"><button type="button" class="btn btn-primary" id="p-go">Veure el meu pla</button></div>
    <p id="p-err" class="muted" aria-live="polite"></p>
  </form>
</div>

<div class="tool" id="p-plan" hidden>
  <h2>🧭 El teu pla</h2>
  <p class="muted" id="p-date"></p>
  <div id="p-crisis" class="notice warn" role="alert" hidden><strong>Gràcies per dir-ho</strong>Pensar a fer-se mal és més comú del que sembla i se'n pot parlar. Truca ara al <a href="tel:024">024</a> (gratuït, 24 h) o, si estàs en perill immediat, al <a href="tel:112">112</a>. No cal que ho passis sol/a.</div>
  <div id="p-heavy" class="notice" hidden><strong>Val la pena parlar-ne amb algú</strong>Les teves respostes indiquen que fa dies que ho passes malament. Un pla d'autoajuda ajuda, però no n'hi ha prou per a tot: parla-ho amb el teu metge de capçalera o amb un psicòleg. <a href="parlar-ne.html#metge">Com fer-ho</a> · <a href="ajuda.html">Trobar ajuda</a></div>
  <h3>Com has estat</h3>
  <ul class="log" id="p-areas"></ul>
  <h3 style="margin-top:24px">Els teus passos</h3>
  <p class="muted">Tria els que et semblin possibles aquesta setmana. Si un pas no et va bé, canvia'l per un altre.</p>
  <ol class="plan" id="p-steps"></ol>
  <p id="p-msg" class="muted" aria-live="polite"></p>
  <div class="btn-row"><a class="btn btn-primary btn-sm" href="meves-dades.html#recordatoris">Posar un recordatori a l'agenda</a><button type="button" class="btn btn-outline btn-sm" id="p-redo">Tornar a respondre</button><button type="button" class="btn btn-outline btn-sm" id="p-wipe">Esborrar el pla</button></div>
  <p class="muted" style="font-size:.9rem;margin-top:18px">Si tens menys de 18 anys, mira també la pàgina <a href="joves.html">per a joves</a>. Si les dificultats duren més de dues setmanes o afecten el teu dia a dia, <a href="ajuda.html">busca ajuda professional</a>.</p>
</div>

</div></section>'''
write("pla.html", with_scripts(page("pla.html", f"El meu pla: petits passos per cuidar-te | {NAME}", "Respon cinc preguntes i rep un pla personal de petits passos amb enllaços a les eines. Es guarda només al teu dispositiu.", body, "eines.html"), ["js/plan-cat.js", "js/pla.js"]))

# ---------- Cerca i índex ----------
body = '''
<section class="page-hero"><div class="container narrow">
  <span class="eyebrow">Cercador</span><h1>Cerca i índex</h1>
  <p class="lead muted">Cerca per paraules a tot el web o busca el tema a l'índex alfabètic.</p>
  <form role="search" id="c-form" novalidate>
    <label for="c-q" class="lbl" style="display:block;font-weight:600;margin-bottom:6px">Què busques?</label>
    <input id="c-q" class="search" type="search" autocomplete="off" placeholder="Ex.: dormir, pànic, parlar amb el metge...">
  </form>
</div></section>
<section style="padding-top:10px"><div class="container narrow">
  <p id="c-count" class="muted" aria-live="polite"></p>
  <ul id="c-results" class="sr-list"></ul>
  <div id="c-az">
    <h2>Índex alfabètic</h2>
    <nav id="c-letters" class="az-nav" aria-label="Lletres de l'índex"></nav>
    <div id="c-groups"></div>
  </div>
  <noscript><p>El cercador necessita JavaScript. Pots consultar directament les <a href="trastorns.html">fitxes de trastorns</a>, les <a href="eines.html">eines</a>, <a href="parlar-ne.html">com parlar-ne</a> i <a href="ajuda.html">on trobar ajuda</a>.</p></noscript>
</div></section>'''
write("cerca.html", with_scripts(page("cerca.html", f"Cerca i índex alfabètic | {NAME}", "Cerca per paraules a tot el web i índex alfabètic de fitxes, eines i guies.", body, "cerca.html"), ["js/cerca.js"]))

# ---------- Qui ho revisa i fonts ----------
if REVIEWERS:
    rev_items = "".join(
        f'<li><strong>{e(r["name"])}</strong> – {e(r["role"])}, {e(r["college"])}. Revisió: {e(r["date"])}. Àmbit: {e(r["scope"])}.</li>' for r in REVIEWERS)
    rev_block = f'<ul>{rev_items}</ul>'
else:
    rev_block = ('<div class="notice"><strong>Pendent</strong>Aquest web encara no ha estat revisat per cap professional col·legiat de la salut mental. '
                 'Fins que ho estigui, considera tot el contingut com a informació general i consulta sempre un professional.</div>'
                 '<p>[Pendent: nom, número de col·legiat/da, especialitat i data de revisió del professional o professionals revisors.]</p>')
body = f'''
<section class="page-hero"><div class="container narrow">
  <span class="eyebrow">Transparència</span><h1>Qui ho revisa i d'on surt la informació</h1>
  <p class="lead muted">Una web de salut mental ha de poder explicar d'on surt el que diu. Aquí tens, sense maquillar, com s'ha fet i què encara està pendent.</p>
</div></section>
<section style="padding-top:10px"><div class="container narrow article" data-read>
  <h2>Revisió professional</h2>
  {rev_block}
  <p>Quan hi hagi un professional revisor, es revisaran les fitxes de trastorns, les eines i els qüestionaris, els telèfons i recursos, i les traduccions. Cada fitxa i guia indicarà si té revisió i quan es va fer.</p>

  <h2>Com s'ha elaborat el contingut</h2>
  <ul>
    <li>Els textos s'han redactat amb l'ajuda d'una eina d'intel·ligència artificial, a partir de les fonts públiques que s'indiquen més avall. Són una síntesi divulgativa: no contenen recerca original ni experiència clínica.</li>
    <li>Les versions en castellà i en anglès són traduccions fetes amb la mateixa eina, sense revisió d'un traductor ni d'un professional.</li>
    <li>Els qüestionaris PHQ-9 i GAD-7 són adaptacions de les escales originals, d'ús lliure, i no són versions validades oficialment en cap de les tres llengües.</li>
    <li>Les eines d'autoajuda es basen en tècniques conegudes de la teràpia cognitivo-conductual. Són un suport, no un tractament.</li>
  </ul>

  <h2>Fonts de referència</h2>
  <ul>
    <li><a href="https://www.who.int/health-topics/mental-health" rel="noopener">Organització Mundial de la Salut – Salut mental</a></li>
    <li><a href="https://canalsalut.gencat.cat" rel="noopener">Canal Salut (Generalitat de Catalunya)</a></li>
    <li><a href="https://www.nice.org.uk/guidance/conditions-and-diseases/mental-health-behavioural-and-neurodevelopmental-conditions" rel="noopener">NICE – Guies clíniques de salut mental</a></li>
    <li><a href="https://portal.guiasalud.es" rel="noopener">GuíaSalud – Guies de pràctica clínica del Sistema Nacional de Salut</a></li>
    <li><a href="https://icd.who.int" rel="noopener">CIE-11 (OMS)</a> i <a href="https://www.psychiatry.org/psychiatrists/practice/dsm" rel="noopener">DSM-5-TR (American Psychiatric Association)</a>, com a classificacions de referència</li>
    <li>Kroenke K, Spitzer RL, Williams JBW. The PHQ-9: validity of a brief depression severity measure. <em>J Gen Intern Med</em>. 2001;16(9):606-613.</li>
    <li>Spitzer RL, Kroenke K, Williams JBW, Löwe B. A brief measure for assessing generalized anxiety disorder: the GAD-7. <em>Arch Intern Med</em>. 2006;166(10):1092-1097.</li>
  </ul>

  <h2>Actualitzacions i errades</h2>
  <p>Última actualització del contingut: {CONTENT_UPDATED}. Els telèfons i els serveis poden canviar: comprova'ls sempre en les webs oficials. Si detectes una errada o una informació que cal actualitzar, consulta les dades de contacte de l'<a href="avis-legal.html">avís legal</a>.</p>

  <h2>Què no fa aquest web</h2>
  <ul>
    <li>No diagnostica ni recomana medicació o tractaments.</li>
    <li>No substitueix la consulta amb un professional sanitari.</li>
    <li>No recull dades personals: <a href="privacitat.html">així ho expliquem</a>.</li>
  </ul>
  <div class="btn-row"><a class="btn btn-primary" href="ajuda.html">Trobar ajuda professional</a><a class="btn btn-outline" href="avis-legal.html">Avís legal i mèdic</a></div>
</div></section>'''
write("fonts-i-revisio.html", with_scripts(page("fonts-i-revisio.html", f"Qui ho revisa i fonts | {NAME}", "Com s'ha elaborat el contingut, quines fonts s'han fet servir i què està pendent de revisió professional.", body, "")))

# ---------- 404 ----------
body = '''<section class="hero"><div class="container narrow"><h1>Pàgina no trobada</h1><p class="lead">Potser l'enllaç ha canviat. Torna a l'inici o consulta els recursos.</p><div class="btn-row"><a class="btn btn-primary" href="/Psicoleg/index.html">Inici</a><a class="btn btn-outline" href="/Psicoleg/ajuda.html">Trobar ajuda</a></div></div></section>'''
write("404.html", with_scripts(page("404.html", f"Pàgina no trobada | {NAME}", "Pàgina no trobada", body, root="/Psicoleg/")))

# ---------- llista de pàgines ----------
# El web no s'ha d'indexar: cada pàgina duu <meta name="robots" content="noindex…"> (vegeu page()).
# NO hi ha sitemap.xml (convida a indexar) ni robots.txt amb «Disallow» (si Google no pot
# rastrejar la pàgina, no veu el noindex i pot acabar llistant-la igualment per l'URL).
urls = ["index.html", "trastorns.html", "eines.html", "eines-tcc.html", "ansietat-social-eines.html", "ansietat-social-assistent.html", "cribratges.html", "ajuda.html", "familiars.html", "parlar-ne.html", "joves.html", "pla.html", "cerca.html", "meves-dades.html", "fonts-i-revisio.html", "avis-legal.html", "privacitat.html"] + [f"trastorns/{c['slug']}.html" for c in CONDITIONS]


write("img/favicon.svg", LOGO.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" '))

# Índex del cercador (a partir de les pàgines ja traduïdes)
for lang, (n, size) in searchindex.build(PAGES, urls, i18n.LANGS).items():
    print(f"cercador {lang}: {n} entrades, {size // 1024} KB")

# Unitats de text (per traduir) i traduccions que falten
os.makedirs(os.path.join(os.path.dirname(os.path.abspath(__file__)), "i18n"), exist_ok=True)
idir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "i18n")
with open(os.path.join(idir, "units.tsv"), "w", encoding="utf-8") as f:
    for h, k in UNITS.items():
        f.write(f"{h}\t{k}\n")
bad = 0
for lang in ("es", "en"):
    miss = sorted(MISSING[lang])
    with open(os.path.join(idir, f"missing-{lang}.tsv"), "w", encoding="utf-8") as f:
        for k in miss:
            f.write(f"{i18n.h6(k)}\t{k}\n")
    print(f"{lang}: {len(miss)} unitats sense traduir de {len(UNITS)}")
    bad += len(miss)
jks, jmiss = jsi18n.build()
for lang in ("es", "en"):
    print(f"js {lang}: {len(jmiss[lang])} cadenes sense traduir de {len(jks)}")
    bad += len(jmiss[lang])
print("OK", len(urls) * 3, "pàgines")
if "--strict" in sys.argv and bad:
    sys.exit(1)
