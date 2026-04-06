# Devine VersaKey — Companion App · CHANGELOG

---

## v2.4.0 — 2026-04-06 · "Dubbele encoder bank + fabrieks CC-nummers"

### 🔍 Bron
- CC-nummers geverifieerd via **Appendix H – Factory Presets** uit de officiële
  Devine VersaKey Series gebruikershandleiding (versie 1.0, 02-11-2020 RV)

### 🐛 Bugfix: Correcte fabrieks CC-nummers
| Knop | v2.3 (fout) | v2.4 (correct) | Naam |
|------|-------------|-----------------|------|
| R1   | CC74        | **CC131**       | Program Change |
| R2   | CC71        | **CC7**         | Volume |
| R3   | CC21        | **CC92**        | Standard MIDI Controller |
| R4   | CC18        | **CC81**        | Standard MIDI Controller |
| R5   | CC73        | **CC91**        | Reverb Depth |
| R6   | CC72        | **CC67**        | Standard MIDI Controller |
| R7   | CC93        | **CC86**        | Standard MIDI Controller |
| R8   | CC7         | **CC93**        | Chorus Depth |

### ✅ Toegevoegd: Dubbele encoder bank (R1–R8 / R9–R16)
- **Wissel → R9–R16** knop in de encoder-balk
  - Schakelt de encoder-weergave tussen bank 1 (R1–R8) en bank 2 (R9–R16)
  - Bank-badge toont duidelijk welke bank actief is (bruin = B1, groen = B2)
  - Beide banken hebben onafhankelijke CC-maps en waarden
  - Activeer bank 2 op de VersaKey hardware via: **EDIT → BANK L of BANK M**
- Bank 2 (R9–R16) heeft geen fabriekswaarden — volledig vrij programmeerbaar
- Encoder-blokken voor bank 2 tonen een **groene kleur** om ze te onderscheiden
- Beide banken worden simultaan gemonitord: CC-berichten worden altijd gerouteerd
  naar de juiste encoder, ook als die bank niet zichtbaar is

### ✅ Toegevoegd: Programmeer-wizard
- **🎛️ Programmeer bank** knop start de wizard voor de actieve bank
- Wizard loopt stap voor stap door alle 8 encoders:
  1. Toon de huidige encoder (R1, R2, ... R8 of R9...R16)
  2. Wacht op een CC-bericht van de VersaKey hardware
  3. Toon het ontvangen CC-nummer met groene bevestiging
  4. "✓ Volgende encoder →" om door te gaan
  5. "⏭ Overslaan" om een encoder over te slaan
- Voortgangsballetjes tonen welke encoders al geprogrammeerd zijn
- Encodernamen aanpasbaar via tekstveld in de wizard
- Resultaat wordt direct de nieuwe actieve koppeling
- `↺ Reset` na de wizard herstelt bank 1 naar fabriekswaarden

### 🔧 Verbeterd
- **`ENC_BANKS`** — array van 2 banken met elk 8 encoder-definities
- **`encMaps`** — array van 2 CC-maps (één per bank)
- **`encVals`** — array van 2 waarde-arrays (één per bank)
- **`switchEncBank()`** — wisselt de actieve encoder-bank
- **`updateEncBankUI()`** — update badge en knop-tekst
- **`initEncMaps()`** — bouwt CC-maps voor beide banken tegelijk
- **`startWizard()` / `wizShowStep()` / `wizHandleCC()` / `wizNext()` / `wizSkip()` / `wizClose()`**
- **`onMidi()`** controleert nu BEIDE bank-maps → route correct ongeacht actieve bank
- **`resetLearn()`** reset bank 1 naar handboekwaarden, bank 2 naar leeg

### sw.js
- Cache `versakey-v5` → **`versakey-v6`**

---

## v2.3.0 — 2026-04-05 · "CC Debug Monitor + Encoder fixes"
- CC Debug Monitor toegevoegd
- Help popup (❓) toegevoegd
- Getal 0-127 altijd zichtbaar gemaakt

## v2.2.0 — 2026-04-05 · "Zoom piano + strips"
- Zoom-knop in statusbalk (1× / 1.5× / 2×)

## v2.1.0 — 2026-04-05 · "Rotary Encoders A+B"
- Rotary Encoder sectie met MIDI Learn

## v2.0.0 — 2026-04-05 · "Chrome & USB-MIDI focus"
- AudioKit J6 verwijderd, USB-MIDI verbeterd

---

## Backlog

| Prioriteit | Feature | Status |
|---|---|---|
| 🔴 Hoog | Encoder preset opslaan/laden (naam + alle 16 CC-koppelingen) | Gepland |
| 🔴 Hoog | Pad-programmatie uitbreiden | Gepland |
| 🟡 Middel | Pad kleuren aanpasbaar via UI | Gepland |
| 🟡 Middel | Velocity curve instelling in UI | Gepland |
| 🟢 Laag | Piano roll visualizer integreren | Gepland |
| 🟢 Laag | Dark mode | Gepland |
| ⏸️ Gepauzeerd | AudioKit / Synth One J6 integratie | On hold |
