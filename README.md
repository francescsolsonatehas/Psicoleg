# Psicòleg

Web de salut mental **en català, castellà i anglès**: fitxes psicoeducatives (21 trastorns i condicions), eines d'autoajuda (respiració, grounding, relaxació, registre d'ànim, diari de pensaments, activació conductual, diari de son, registre de pànic), eines de TCC per a l'ansietat social amb assistent d'IA opcional, cribratges PHQ-9 / GAD-7, guies («Com parlar-ne», per a joves, per a familiars) i recursos d'ajuda a Catalunya.

- HTML + CSS + JavaScript pur, sense dependències en execució. Les pàgines es **generen** amb Python (`build/`).
- Tipografies pròpies (Inter, Poppins; SIL OFL), sense peticions a tercers.
- Sense comptes ni cookies: els registres es guarden només al navegador (localStorage). Es poden imprimir, exportar i importar (`meves-dades.html`) i es poden crear recordatoris `.ics`.
- Barra d'ajuda urgent (112 / 024) visible a totes les pàgines.
- Mode clar/fosc, mida de text ajustable, lectura en veu alta, `prefers-reduced-motion`.

Publicat amb GitHub Pages: https://francescsolsonatehas.github.io/Psicoleg/ (català), `/es/` (castellano), `/en/` (English).

## Com es genera

```bash
python3 build/build.py            # regenera totes les pàgines (ca, es, en) i js/lang/*.js
python3 build/build.py --strict   # falla si falta alguna traducció
python3 scripts/check-links.py    # enllaços interns, àncores i telèfons (--external: també externs)
```

- El contingut en català és la font: `build/build.py` (pàgines) i `build/data.py` (fitxes de trastorns).
- Les pàgines `es/` i `en/` es generen traduint cada text per identificador: `build/i18n/<lang>.tsv` (HTML) i `build/i18n/js.<lang>.tsv` (JavaScript). `build/i18n/missing-*.tsv` llista el que falta per traduir.
- No editis a mà els `.html` ni `js/lang/*.js`: es reescriuen en generar.
- GitHub Actions comprova enllaços i telèfons a cada push i, setmanalment, també els enllaços externs.

> Contingut informatiu. No substitueix un professional sanitari. Cal que un psicòleg o psiquiatre col·legiat revisi el contingut clínic (i les traduccions) abans de difondre'l, i completar les dades del titular a `avis-legal.html`.
