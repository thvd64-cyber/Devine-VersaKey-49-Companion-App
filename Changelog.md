# Devine VersaKey — Companion App · CHANGELOG

---

## v2.2.0 — 2026-04-05 · "Zoom piano + strips"

### ✅ Toegevoegd
- **Zoom-knop** in de statusbalk onderaan (`−` `1×` `+`)
  - 3 vaste niveaus: **1×** (normaal) · **1.5×** (middelgroot) · **2×** (groot)
  - Zoomt **alleen** de piano-toetsen en de 2 touch-strips (PITCH + MOD)
  - De rest van de app (topbar, encoders, pads) blijft ongewijzigd
  - `−` en `+` worden automatisch uitgegrayd aan de uiteinden
  - Zoom-niveau wordt **onthouden** via `localStorage` (blijft na herladen)
- **CSS `--zoom`** custom property op `:root` — strips schalen via `calc()`
- **`ZOOM_LEVELS`** array `[1, 1.5, 2]` + `zoomIdx` toestandsvariabele
- **`applyZoom()`** — berekent nieuwe toetsafmetingen, past CSS aan, herbouwt piano
- **`chZoom(d)`** — verhoog of verlaag het zoom-niveau met 1 stap

### 🔧 Verbeterd
- `buildKB(n, s, ww, wh, bw, bh)` — accepteert nu optionele afmetingsparameters zodat zoom direct meegegeven kan worden
- Initialisatie roept `applyZoom()` aan ná `setModel()` zodat het opgeslagen zoom-niveau direct actief is bij openen

### sw.js
- Cache `versakey-v3` → **`versakey-v4`**

---

## v2.1.0 — 2026-04-05 · "Rotary Encoders A+B"

### ✅ Toegevoegd
- Rotary Encoder sectie met 8 live CC-meter balken (Voorstel A)
- MIDI Learn modus per encoder via CC-badge klikken (Voorstel B)
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

## v2.1.0 — 2026-04-05 · "Rotary Encoders A+B"

### ✅ Toegevoegd
- **Rotary Encoder sectie** — nieuwe balk tussen de topbar en de drum pads
- **Voorstel A: Live CC-meter balken**
  - 8 gekleurde balken (één per encoder R1-R8) die live bewegen bij draaien
  - Kleurcodering: oranje=filter, groen=LFO, paars=envelope, blauw=FX, grijs=volume
  - Numerieke waarde (0-127) zichtbaar naast elke balk
  - Startwaarde 64 (midden) voor alle encoders
- **Voorstel B: MIDI Learn modus per encoder**
  - Klik op de CC-badge (bijv. "CC74") → encoder gaat in learn-modus (pulserende rand)
  - Draai de gewenste hardware-knop → CC-koppeling wordt automatisch opgeslagen
  - Status-tekst toont welke encoder wacht op input
  - Bevestiging "✓ R1 = CC74 opgeslagen" na succesvolle koppeling
  - "Reset Learn" knop herstelt alle standaard CC-nummers uit het handboek

### 🔧 Verbeterd
- `onMidi()` uitgebreid: CC-berichten worden nu eerst gecontroleerd op learn-modus, dan op encoder-map, dan op vaste CC-nummers
- `initEncMap()` toegevoegd: bouwt de CC→encoder koppelingsmap bij opstart
- Volume-encoder (R8, CC7) is bidirectioneel gekoppeld: draai hardware → topbar volume-waarde meebewegen

### 📋 Volgende stap (backlog)
- Voorstel C: Preset-systeem (opslaan/laden van encoder-combinaties)
- Pad-programmatie uitbreiden

---

## v2.0.0 — 2026-04-05 · "Chrome & USB-MIDI focus"

### 🗑️ Verwijderd
- AudioKit / Synth One J6 sectie volledig verwijderd
- Dubbele HTML-code verwijderd

### ✅ Toegevoegd
- USB-hint balk, versie-badge, inline code-commentaar, console logging
- Automatische VersaKey-herkenning, `onstatechange` handler

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

## v2.0.0 — 2026-04-05 · "Chrome & USB-MIDI focus"

### 🗑️ Verwijderd
- **AudioKit / Synth One J6 sectie** volledig verwijderd uit `index.html`
  - De donkere J6-balk (CUTOFF, REZ, LFO RATE...) is weg
  - De `J6MAP`, `j6Update()`, `buildJ6()`, `sendCC()`, `sendNoteOn()`, `sendNoteOff()` functies zijn verwijderd
  - Reden: AudioKit J6 wordt niet verder ontwikkeld in dit project

- **Dubbele HTML-code** verwijderd
  - Het bestand bevatte twee volledige versies van de app gestapeld — nu is er één schone versie

### ✅ Toegevoegd
- **USB-hint balk**: verschijnt als er geen MIDI gevonden wordt, met uitleg wat te doen
- **Versie-badge** in de topbar (v2.0)
- **Inline code-commentaar**: elke coderegel heeft een uitleg in het Nederlands
- **Console logging**: alle MIDI-events worden gelogd (handig voor debuggen)
- **Automatische VersaKey-herkenning**: zoekt op naam "versa" of "devine"
- **`onstatechange`** handler: als je de USB-kabel aanplugt terwijl de app open is, herkent hij het apparaat automatisch

### 🔧 Verbeterd
- **MIDI initialisatie** opgeruimd en robuuster gemaakt voor Windows/Android/Chrome
- **CSS variabelen** volledig gedocumenteerd
- **Responsief ontwerp** beter uitgelegd in de code

### 📋 Platform focus
- **✅ Windows + Chrome/Edge** via USB-kabel
- **✅ Android + Chrome** via USB-OTG kabel
- **✅ PWA installeerbaar** op beide platforms
- **❌ Firefox** — ondersteunt Web MIDI API niet (hinttekst verschijnt)
- **❌ Safari/iOS** — ondersteunt Web MIDI API niet

---

## v1.x — 2025 (oorspronkelijke versie)

- Twee versies bestonden naast elkaar in één bestand
- Versie 1: basis keyboard + drum pads
- Versie 2: + AudioKit Synth One J6 CC Sync sectie
- `visualizer.html`: aparte piano roll visualizer (blijft apart beschikbaar)

---

## Backlog (geplande functies)

| Prioriteit | Feature | Status |
|---|---|---|
| 🔴 Hoog | MIDI output (CC sturen naar extern apparaat) | Gepland |
| 🔴 Hoog | Betere octaaf-scrolling op kleine schermen | Gepland |
| 🟡 Middel | Pad kleuren aanpasbaar via UI | Gepland |
| 🟡 Middel | Velosity curve instelling in UI | Gepland |
| 🟢 Laag | Piano roll visualizer integreren in hoofdapp | Gepland |
| 🟢 Laag | Dark mode | Gepland |
| ⏸️ Gepauzeerd | AudioKit / Synth One J6 integratie | On hold |
