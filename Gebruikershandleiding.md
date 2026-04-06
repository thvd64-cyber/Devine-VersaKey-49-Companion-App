# 📖 Gebruikershandleiding — Devine VersaKey Companion App
**Versie: 2.2.0 · Datum: 2026-04-05**

---

## 📋 Inhoudsopgave
1. [Wat is deze app?](#wat-is-deze-app)
2. [Wat heb je nodig?](#wat-heb-je-nodig)
3. [Stap-voor-stap: De app starten](#stap-voor-stap-de-app-starten)
4. [Het scherm uitgelegd](#het-scherm-uitgelegd)
5. [De piano spelen](#de-piano-spelen)
6. [Zoom — piano groter of kleiner](#zoom--piano-groter-of-kleiner)
7. [Rotary Encoders (draaiknoppen)](#rotary-encoders-draaiknoppen)
8. [MIDI Learn — encoders koppelen](#midi-learn--encoders-koppelen)
9. [Drum Pads](#drum-pads)
10. [Touch Strips — Pitch & Mod](#touch-strips--pitch--mod)
11. [Geluid instellen](#geluid-instellen)
12. [Octaaf en Transpositie](#octaaf-en-transpositie)
13. [Als je VersaKey verbindt via USB](#als-je-versakey-verbindt-via-usb)
14. [Als het niet werkt](#als-het-niet-werkt)
15. [Installeren als app (PWA)](#installeren-als-app-pwa)
16. [Modellen — hoeveel toetsen?](#modellen--hoeveel-toetsen)
17. [Wat gaat er nog komen? (Backlog)](#wat-gaat-er-nog-komen-backlog)
18. [Versiegeschiedenis](#versiegeschiedenis)

---

## 🎹 Wat is deze app?

De **Devine VersaKey Companion App** is een gratis webapp die je samen met je VersaKey MIDI-keyboard gebruikt. Je opent hem gewoon in Chrome of Edge — niets hoeft geïnstalleerd te worden!

De app doet twee dingen:
1. **Geluid maken** — speel noten via de browser (Web Audio), ook zonder VersaKey
2. **MIDI-verbinding** — verbind je fysieke VersaKey via USB-kabel en zie alles live reageren

**Werkt op:**
| Platform | Browser | Verbinding |
|---|---|---|
| Windows 10/11 | ✅ Chrome of Edge | USB-kabel |
| Android (telefoon/tablet) | ✅ Chrome | USB-OTG kabel |
| iOS / iPhone | ❌ Niet ondersteund | — |
| Firefox (alle platforms) | ❌ Niet ondersteund | — |

---

## 🛒 Wat heb je nodig?

- Een computer (Windows) of Android-telefoon/tablet
- **Chrome** of **Edge** browser (gratis te downloaden)
- Optioneel: je **Devine VersaKey** keyboard (VK-25, VK-49, VK-61 of VK-88)
- Optioneel: een **USB-kabel** (USB-A naar USB-B, als bij een printer)
- De app: open `index.html` in je browser

> 💡 **Tip voor kinderen:** Je kunt de app ook gebruiken zonder keyboard! Klik gewoon op de piano-toetsen op het scherm.

---

## 🚀 Stap-voor-stap: De app starten

### Zonder VersaKey (alleen scherm-piano):
1. Open `index.html` in Chrome of Edge
2. Klik op een piano-toets → je hoort geluid! ✅

### Met VersaKey via USB-kabel:
1. Sluit je VersaKey aan op de computer met de USB-kabel
2. Open `index.html` in **Chrome** of **Edge**
3. De browser vraagt: *"Wil je MIDI-toegang toestaan?"* → klik **Toestaan**
4. Rechtsboven zie je een groen bolletje 🟢 met de naam van je keyboard
5. Speel een toets op de VersaKey → de piano op het scherm reageert! ✅

> ⚠️ **Gebruik NOOIT Firefox** — die ondersteunt USB-MIDI niet.

---

## 🖥️ Het scherm uitgelegd

Het scherm is van boven naar beneden verdeeld in 5 delen:

```
┌─────────────────────────────────────────┐
│  TOPBAR: Logo · Model · Geluid · Volume  │
├─────────────────────────────────────────┤
│  ENCODERS: 8 draaiknoppen (R1–R8)        │
├─────────────────────────────────────────┤
│  DRUM PADS: 8 gekleurde pads             │
├─────────────────────────────────────────┤
│  PIANO + TOUCH STRIPS                    │
├─────────────────────────────────────────┤
│  STATUSBALK: Nootnaam · LED · ZOOM       │
└─────────────────────────────────────────┘
```

---

## 🎹 De piano spelen

### Via het scherm (muis of aanraking):
- **Klik** op een witte of zwarte toets → noot klinkt
- **Aanraken** op telefoon/tablet werkt ook

### Via je computertoetsenbord:
| Toets | Noot |
|---|---|
| A | C |
| W | C# |
| S | D |
| E | D# |
| D | E |
| F | F |
| T | F# |
| G | G |
| Y | G# |
| H | A |
| U | A# |
| J | B |
| **Spatie** | **Sustain aan/uit** |

### Via je VersaKey (USB):
Gewoon spelen! De app reageert automatisch op alles wat je speelt.

---

## 🔍 Zoom — piano groter of kleiner *(Nieuw in v2.2.0)*

Onderaan het scherm staat de **ZOOM** knop. Hiermee vergroot of verklein je de piano-toetsen en de touch-strips.

| Knop | Effect |
|---|---|
| `−` | Piano kleiner (1 stap terug) |
| `1×` | Huidige zoom-niveau |
| `+` | Piano groter (1 stap groter) |

**3 niveaus beschikbaar:**
- **1×** — Normaal (standaard)
- **1.5×** — Middelgroot (handig op tablet)
- **2×** — Groot (handig op grote schermen of als je dikke vingers hebt 😄)

> 💾 **De app onthoudt je keuze!** Als je de pagina herlaadt, staat de zoom nog op hetzelfde niveau.

> ℹ️ Alleen de piano en de twee strips zoomen mee. De rest van de app blijft hetzelfde.

---

## 🎛️ Rotary Encoders (draaiknoppen) *(Toegevoegd in v2.1.0)*

De VersaKey heeft 8 fysieke draaiknoppen (R1 t/m R8). In de app zie je 8 gekleurde balkjes die live meebewegen als je draait.

### Standaard koppelingen:

| Knop | Naam | CC | Kleur |
|---|---|---|---|
| R1 | Cutoff (Filter) | CC74 | 🟠 Oranje |
| R2 | Resonantie | CC71 | 🟠 Oranje |
| R3 | LFO Rate | CC21 | 🟢 Groen |
| R4 | Detune | CC18 | 🟢 Groen |
| R5 | Attack | CC73 | 🟣 Paars |
| R6 | Release | CC72 | 🟣 Paars |
| R7 | Chorus / FX | CC93 | 🔵 Blauw |
| R8 | Volume | CC7 | ⚫ Grijs |

> 💡 **R8 (Volume)** is speciaal: als je de knop op de VersaKey draait, beweegt ook de volume-schuifbalk in de topbar mee!

---

## 🎓 MIDI Learn — encoders koppelen *(Toegevoegd in v2.1.0)*

Heb je de VersaKey zo ingesteld dat een knop een ander CC-nummer stuurt? Dan kun je de app dat leren!

### Hoe werkt MIDI Learn?

1. **Klik** op de kleine CC-badge van een encoder (bijv. `CC74` naast R1)
   → het blokje begint te *pulsen* (knipperen) en wordt oranje
2. **Draai** de gewenste hardware-knop op je VersaKey
   → de app slaat de koppeling op! ✅
3. De badge toont nu het nieuwe CC-nummer

### Reset Learn:
Klik op **"Reset Learn"** om alle koppelingen terug te zetten naar de standaard CC-nummers uit het handboek.

> ℹ️ Wil je een learn-sessie annuleren? Klik nog een keer op de CC-badge van dezelfde encoder.

---

## 🥁 Drum Pads

8 gekleurde pads voor drums en percussie.

### Bank 1–8 (standaard):
| Pad | Kleur | Instrument | MIDI |
|---|---|---|---|
| 1 | 🔴 Rood | Kick | C1 |
| 2 | 🟤 Bruin | Snare | D1 |
| 3 | 🔵 Blauw | Hi-Hat (gesloten) | F#1 |
| 4 | 🟢 Groen | Hi-Hat (open) | A#1 |
| 5 | 🟣 Paars | Tom Laag | F1 |
| 6 | 🟠 Oranje | Tom Hoog | D2 |
| 7 | 🔴 Rood | Crash Cymbal | C#2 |
| 8 | 🩵 Blauwgroen | Ride Cymbal | D#2 |

### Wisselen naar Bank 9–16:
Klik op de knop **"Bank 1–8"** → hij wordt **"Bank 9–16"** met extra percussie.

---

## 🎚️ Touch Strips — Pitch & Mod

Links van de piano staan twee smalle strips.

### PITCH (blauw):
- Sleep omhoog → toon wordt **hoger**
- Sleep omlaag → toon wordt **lager**
- Loslaten → veert terug naar het midden (geen buiging)

### MOD (oranje):
- Sleep omhoog → meer modulatie (vibrato, filter, etc.)
- De strip **blijft staan** waar je hem zet — net zoals op de echte VersaKey!

> 🔍 De strips worden groter/kleiner mee met de **Zoom** functie.

---

## 🎵 Geluid instellen

Bovenaan in de topbar kun je het instrument kiezen:

| Groep | Voorbeelden |
|---|---|
| Piano | Grand Piano, E-Piano, Harpsichord |
| Orgel | Drawbar Organ, Church Organ |
| Gitaar | Nylon Guitar, Distortion Guitar |
| Strijkers | Violin, Strings |
| Blaas | Trumpet, Brass Section |
| Synth | Square, Sawtooth, Warm Pad |
| Bas | Acoustic Bass, Synth Bass |

> 💡 Het geluid wordt gemaakt door de browser (Web Audio API) — geen samples nodig!

---

## 🎼 Octaaf en Transpositie

### Octaaf (Oct):
- Klik `−` of `+` naast "Oct" om de piano een octaaf omhoog of omlaag te schuiven
- Handig als je hogere of lagere noten wilt spelen dan het scherm toont

### Transpositie (Transp):
- Klik `−` of `+` naast "Transp" om alle noten halve tonen te verschuiven
- Bijv. `+3` = alles 3 halve tonen hoger (C → D#)
- Handig voor een ander akkoord zonder je vingers anders te zetten

---

## 🔌 Als je VersaKey verbindt via USB

### Stap 1: Kabel aansluiten
Sluit de USB-kabel aan van je VersaKey naar de computer.

### Stap 2: MIDI toestaan
Chrome vraagt toestemming. Klik **"Toestaan"**.

### Stap 3: Apparaat kiezen
Onder de topbar verschijnt een groene balk met een dropdown. Kies je VersaKey.
De app zoekt automatisch naar een apparaat met "versa" of "devine" in de naam.

### Stap 4: Genieten! 🎹
Het groene bolletje 🟢 in de topbar toont dat je verbonden bent.

### USB aanprikken terwijl de app open is:
De app herkent je VersaKey automatisch als je de USB-kabel aanplugt.

---

## 🆘 Als het niet werkt

| Probleem | Oplossing |
|---|---|
| Geen geluid | Klik eerst ergens op het scherm (browser-vereiste voor audio) |
| "MIDI: niet ondersteund" | Gebruik Chrome of Edge — Firefox werkt niet! |
| "MIDI: geweigerd" | Klik op herladen en kies "Toestaan" bij de MIDI-vraag |
| Geen apparaat gevonden | Controleer de USB-kabel, sluit opnieuw aan, klik op het MIDI-bolletje |
| App laadt niet | Zorg dat `sw.js` en `manifest.json` in dezelfde map staan als `index.html` |
| Zoom werkt niet | Wis je browser-cache (Ctrl+Shift+R) om de nieuwe versie te laden |

---

## 📱 Installeren als app (PWA)

Je kunt de app installeren als een echte app op je bureaublad of telefoon!

### Windows (Chrome/Edge):
1. Open de app in Chrome
2. Klik rechtsboven op het installeer-icoon 📥 in de adresbalk
3. Klik "Installeren"
4. De app staat nu in je Startmenu!

### Android (Chrome):
1. Open de app in Chrome
2. Tik op de drie puntjes `⋮` rechtsbovenin
3. Kies "Toevoegen aan startscherm"
4. De app staat nu op je startscherm!

> 💡 De app werkt ook **offline** nadat je hem eens hebt geladen — dankzij de Service Worker.

---

## 🎹 Modellen — hoeveel toetsen?

Kies het model dat overeenkomt met jouw VersaKey:

| Knop | Model | Toetsen | Bereik |
|---|---|---|---|
| VK-25 | VersaKey 25 | 25 | C3 – C5 |
| VK-49 | VersaKey 49 | 49 | C2 – C6 |
| VK-61 | VersaKey 61 | 61 | C2 – C7 |
| VK-88 | VersaKey 88 | 88 | A0 – C8 |

---

## 🗓️ Wat gaat er nog komen? (Backlog)

| Prioriteit | Functie |
|---|---|
| 🔴 Hoog | Voorstel C: Preset-systeem voor encoder-combinaties |
| 🔴 Hoog | Pad-programmatie uitbreiden |
| 🟡 Middel | Pad kleuren aanpasbaar via UI |
| 🟡 Middel | Velocity curve instelling in UI |
| 🟢 Laag | Piano roll visualizer integreren in hoofdapp |
| 🟢 Laag | Dark mode |
| ⏸️ Gepauzeerd | AudioKit / Synth One J6 integratie |

---

## 📜 Versiegeschiedenis

| Versie | Datum | Wat is er nieuw? |
|---|---|---|
| **v2.2.0** | 2026-04-05 | ✅ Zoom-knop piano en strips (3 niveaus, wordt onthouden) |
| **v2.1.0** | 2026-04-05 | ✅ Rotary Encoders met live CC-meters en MIDI Learn |
| **v2.0.0** | 2026-04-05 | ✅ USB-MIDI focus, J6 sectie verwijderd, versie-badge |
| **v1.x** | 2025 | Eerste versie met piano + drum pads |

---

*Gemaakt voor muzikanten, producers en techneuten die met de Devine VersaKey aan de slag willen. 🎵*
