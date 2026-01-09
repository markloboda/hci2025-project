# 🏔️ Hribi.net: prenova spletne strani (KČR 2025/2026)

Projekt vsebuje prenovo spletne strani **hribi.net**, enega najbolj uporabljenih slovenskih portalov za pohodnike.
Obstoječa stran vsebuje veliko informacij, vendar je začetna stran pogosto nepregledna, dizajn je zastarel, uporaba na telefonu pa je nerodna.   

Cilj prenove je bolj jasen in sodoben vmesnik, kjer uporabnik hitreje pride do ključnih vsebin:

- iskanje vrhov in izletov,
- zemljevid,
- vreme,
- spletne kamere.

## Glavne funkcionalnosti (MVP)

- **Interaktivni zemljevid** za raziskovanje vrhov in lokacij.
- **Napredno iskanje** z osnovnimi filtri (težavnost, regija, sezona).
- **Stran vrha** z opisom, slikami in podatki o poteh.
- **Spletne kamere** v mrežnem prikazu.
- **Vreme** za gore prek API-ja **OpenWeatherMap**.

## Zakaj prenova (HCI pogled)

Pri naši raziskavi (anketa in pregled sorodnih strani) smo prepoznali predvsem:
- preveč vsebine na začetni strani,
- slabo vizualno hierarhijo (težko je hitro najti pomembne stvari),
- nepreglednost in težka uporaba na mobilnih napravah.

Zato smo si zadali cilje:
1. poenostaviti začetno stran in navigacijo,
2. izboljšati iskanje in filtriranje,
3. narediti vmesnik *mobile-first*,
4. ohraniti glavne funkcije, ki jih uporabniki dejansko uporabljajo.

## Struktura repozitorija

Projekt je razdeljen na dva dela:

### `/hribi-redesign`
Angular aplikacija (MVP):
- zemljevid,
- strani vrhov,
- vreme,
- kamere,
- iskanje.

### `/portfolio`
Materiali in dokumentacija projekta:
- anketa + rezultati,
- raziskava podobnih rešitev,
- prototipi (*low-fi* + Figma),
- `feedback.txt` (komentarji po predstavitvi prototipov),
- predstavitev (week 8),
- projektni predlog (LaTeX).
