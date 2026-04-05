# Devine VersaKey — Companion App · CHANGELOG
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
