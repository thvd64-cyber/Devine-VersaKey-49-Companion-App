# Devine VersaKey — Companion App · CHANGELOG

---

## v2.6.0 — 2026-04-08 · "Pad Programmatie"

### Doel
Volledige programmatie van alle 16 drum pads (bank 1–8 én bank 9–16).
Drop-in module pad-programmer.js — één script-tag toevoegen aan index.html.

### Nieuw: pad-programmer.js

**Functies per pad:**
- MIDI noot instellen — welke noot stuurt elke pad (0–127, bijv. C2)
- CC-nummer instellen — pad als controller in plaats van drum trigger
- Pad naam aanpassen — max 16 tekens
- Pad kleur kiezen — 8 kleuren: rood, oranje, bruin, groen, blauwgroen, blauw, paars, grijs
- MIDI kanaal per pad — standaard 10 (GM drums), aanpasbaar
- Instellingen persistent — localStorage, blijven na herladen

**MIDI Learn:**
- Lang indrukken of rechtsklik op pad → editor popup
- Klik "MIDI Learn noot" → sla VersaKey pad aan → gekoppeld
- Klik "Learn CC" voor CC-modus
- Automatisch timeout na 10 seconden

**Bank 9–16:**
- Volledig programmeerbaar, zelfde functies als bank 1–8
- Fabriekswaarden bank 2: Clap, Rim Shot, Cowbell, Tambourine, Bongo's, Agogo
- Wissel via "Wissel naar 9–16" knop

**Reset:**
- "Reset bank" knop — herstelt actieve bank naar fabriekswaarden
- window.PadProgrammer.resetAll() — reset beide banken

### Technisch

Nieuwe functies in pad-programmer.js:
- FACTORY_BANKS — 2 banken x 8 pads met fabriekswaarden
- PAD_COLORS — 8 kleurdefinities
- savePads() / loadPads() — localStorage persistentie
- hookMidi() — koppelt aan app via CustomEvent, Web MIDI API en iOS bridge
- triggerPad() — stuurt padMidiOut CustomEvent
- buildUI() / renderPads() — DOM opbouw
- openEditor() / closeEditor() — editor popup
- startLearn() / applyLearn() / cancelLearn() — MIDI Learn flow
- toggleBank() / resetActiveBank() — bank beheer

Publiek API:
- window.PadProgrammer.getBanks()
- window.PadProgrammer.setPad(bankIdx, padIdx, props)
- window.PadProgrammer.resetAll()
- window.PadProgrammer.switchBank()

Integratie in index.html:
  Voeg toe vóór </body>:  <script src="pad-programmer.js"></script>

Uitgaand event voor geluidsweergave:
  window.addEventListener('padMidiOut', e => { ... });
  e.detail = { type:'note', note, velocity, channel }
  e.detail = { type:'cc',   cc,   value,    channel }

### Geleverde bestanden
- pad-programmer.js — volledig gedocumenteerde module
- pad-programmer-demo.html — standalone testpagina met MIDI monitor

### sw.js
- Cache versakey-v6 naar versakey-v7

---

## v2.5.0 — 2026-04-08 · "iOS Platform Support"

iPad en iPhone via native Swift app (WKWebView + CoreMIDI).
Bestanden: MIDIManager.swift, ViewController.swift, AppDelegate.swift,
SceneDelegate.swift, Info.plist, midi-ios-bridge.js.

---

## v2.4.0 — 2026-04-06 · "Dubbele encoder bank + fabrieks CC-nummers"

Bugfix CC-nummers, dubbele encoder bank R1-R16, programmeer-wizard.

---

## v2.3.0 — 2026-04-05 · "CC Debug Monitor"
## v2.2.0 — 2026-04-05 · "Zoom piano + strips"
## v2.1.0 — 2026-04-05 · "Rotary Encoders A+B"
## v2.0.0 — 2026-04-05 · "Chrome & USB-MIDI focus"

---

## Backlog

| Prioriteit | Feature | Status |
|---|---|---|
| Hoog | Encoder preset opslaan/laden | Gepland |
| Middel | iOS app distribueren via TestFlight | Gepland |
| Middel | Pad preset opslaan/laden | Gepland |
| Middel | Velocity curve instelling in UI | Gepland |
| Laag | Piano roll visualizer | Gepland |
| Laag | Dark mode | Gepland |
| Gepauzeerd | AudioKit / Synth One J6 integratie | On hold |
