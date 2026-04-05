# Devine VersaKey — Companion App · CHANGELOG

---

## v2.3.0 — 2026-04-05 · "CC Debug Monitor + Encoder fixes"

### ✅ Toegevoegd
- **CC Debug Monitor** — nieuwe blauwe balk tussen topbar en encoder-sectie
  - Toont **live** welk CC-nummer binnenkomt als je een knop draait
  - 8 mini-blokjes (R1–R8) tonen per slot het CC-nummer en de waarde
  - Grote live-tekst: "Laatste: CC74 = 87 → Cutoff (R1)"
  - "Verberg" knop om de balk te sluiten; "📊 CC" knop om hem terug te tonen
  - **Essentieel** om te controleren welke CC-nummers jouw VersaKey stuurt
- **❓ Help popup** — klik op ❓ naast "Encoders"
  - Legt uit: wat is een CC-badge, hoe werkt MIDI Learn stap voor stap
  - Legt uit: wat doet "↺ Reset Learn"
  - Legt uit: wat is de CC Monitor balk
- **R-nummer label** (R1–R8) boven elke encoder-balk toegevoegd voor duidelijkheid
- **`buildCCSlots()`** — nieuwe functie die de 8 debug-blokjes bouwt
- **`updateCCSlot(slotIdx, ccNum, ccVal)`** — update één debug-blokje live
- **`showHelp()` / `hideHelp()`** — toon/verberg de help popup

### 🔧 Verbeterd
- **Getal (0–127)** bij elke encoder-balk nu altijd zichtbaar:
  - Lettergrootte 10px (was 9px)
  - Kleur `--text` donkerbruin (was `--muted` grijs)
  - Vetgedrukt (`font-weight: 700`)
- **`onMidi()`** — CC-berichten loggen nu ALTIJD naar de console:
  - Formaat: `CC74 = 87 → encoder R1 (Cutoff)` of `CC74 = 87 (niet gekoppeld)`
  - Zo kun je in Chrome F12 → Console precies volgen wat binnenkomt
- **`resetLearn()`** toont nu ook welke CC-nummers hersteld zijn in de status-tekst
- **`finishLearn()`** logt nu voor én na de koppeling de volledige encMap naar console
- **Encoder-routing fix**: `encMap[d1]` wordt nu opgeslagen in `var encIdx` voor
  duidelijker code en correcte lookup ook als `d1 === 0`
- Volume-encoder controle verbeterd: gebruikt nu `ENC_DEF[7].cc` i.p.v. hardcoded `7`
- Versie-badge bijgewerkt naar `v2.3`
- Title-attribuut op CC-badge bevat nu uitleg over MIDI Learn
- Title-attribuut op "↺ Reset Learn" bevat uitleg

### sw.js
- Cache `versakey-v4` → **`versakey-v5`**

---

## Backlog

| Prioriteit | Feature | Status |
|---|---|---|
| 🔴 Hoog | Voorstel C: Preset-systeem voor encoder-combinaties | Gepland |
| 🔴 Hoog | Pad-programmatie uitbreiden | Gepland |
| 🟡 Middel | Pad kleuren aanpasbaar via UI | Gepland |
| 🟡 Middel | Velocity curve instelling in UI | Gepland |
| 🟢 Laag | Piano roll visualizer integreren | Gepland |
| 🟢 Laag | Dark mode | Gepland |
| ⏸️ Gepauzeerd | AudioKit / Synth One J6 integratie | On hold |

---

## v2.2.0 — 2026-04-05 · "Zoom piano + strips"

### ✅ Toegevoegd
- **Zoom-knop** in de statusbalk onderaan (`−` `1×` `+`)
  - 3 vaste niveaus: **1×** (normaal) · **1.5×** (middelgroot) · **2×** (groot)
  - Zoomt **alleen** de piano-toetsen en de 2 touch-strips (PITCH + MOD)
  - `−` en `+` worden automatisch uitgegrayd aan de uiteinden
  - Zoom-niveau wordt **onthouden** via `localStorage`
- **CSS `--zoom`** custom property op `:root`
- **`ZOOM_LEVELS`** array + `zoomIdx` toestandsvariabele
- **`applyZoom()`** en **`chZoom(d)`**

### sw.js
- Cache `versakey-v3` → `versakey-v4`

---

## v2.1.0 — 2026-04-05 · "Rotary Encoders A+B"

### ✅ Toegevoegd
- Rotary Encoder sectie met 8 live CC-meter balken
- MIDI Learn modus per encoder via CC-badge klikken
- `initEncMap()`, `buildEncoders()`, `updEncoder()`, `ccLearn()`, `stopLearn()`, `finishLearn()`, `resetLearn()`

### sw.js
- Cache `versakey-v2` → `versakey-v3`

---

## v2.0.0 — 2026-04-05 · "Chrome & USB-MIDI focus"

### 🗑️ Verwijderd
- AudioKit / Synth One J6 sectie volledig verwijderd
- Dubbele HTML-code verwijderd

### ✅ Toegevoegd
- USB-hint balk, versie-badge, inline code-commentaar, console logging
- Automatische VersaKey-herkenning, `onstatechange` handler

---

## v1.x — 2025 (oorspronkelijke versie)
- Twee versies naast elkaar in één bestand
- `visualizer.html`: aparte piano roll visualizer
