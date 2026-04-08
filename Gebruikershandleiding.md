# 📖 Gebruikershandleiding — Devine VersaKey Companion App
**Versie: 2.6.0 · Datum: 2026-04-08**

---

## 📋 Inhoudsopgave
1. [Wat is deze app?](#wat-is-deze-app)
2. [Wat heb je nodig?](#wat-heb-je-nodig)
3. [Stap-voor-stap: De app starten](#stap-voor-stap-de-app-starten)
4. [iPad en iPhone gebruiken](#ipad-en-iphone-gebruiken)
5. [Het scherm uitgelegd](#het-scherm-uitgelegd)
6. [De piano spelen](#de-piano-spelen)
7. [Zoom — piano groter of kleiner](#zoom--piano-groter-of-kleiner)
8. [Rotary Encoders (draaiknoppen)](#rotary-encoders-draaiknoppen)
9. [MIDI Learn — encoders koppelen](#midi-learn--encoders-koppelen)
10. [Drum Pads](#drum-pads)
11. [Touch Strips — Pitch & Mod](#touch-strips--pitch--mod)
12. [Geluid instellen](#geluid-instellen)
13. [Octaaf en Transpositie](#octaaf-en-transpositie)
14. [Als je VersaKey verbindt via USB](#als-je-versakey-verbindt-via-usb)
15. [Als het niet werkt](#als-het-niet-werkt)
16. [Installeren als app (PWA)](#installeren-als-app-pwa)
17. [Modellen — hoeveel toetsen?](#modellen--hoeveel-toetsen)
18. [Wat gaat er nog komen? (Backlog)](#wat-gaat-er-nog-komen-backlog)
19. [Versiegeschiedenis](#versiegeschiedenis)

---

## 🎹 Wat is deze app?

De **Devine VersaKey Companion App** is een gratis app die je samen met je VersaKey MIDI-keyboard gebruikt. Op Windows en Android open je hem in Chrome of Edge — niets hoeft geïnstalleerd te worden. Op iPad en iPhone gebruik je de speciale VersaKey Companion iOS app.

De app doet twee dingen:
1. **Geluid maken** — speel noten via de browser (Web Audio), ook zonder VersaKey
2. **MIDI-verbinding** — verbind je fysieke VersaKey via USB-kabel en zie alles live reageren

**Werkt op:**
| Platform | Hoe | Verbinding |
|---|---|---|
| Windows 10/11 | ✅ Chrome of Edge (browser) | USB-B kabel |
| Android (telefoon/tablet) | ✅ Chrome (browser) | USB-OTG kabel |
| iPad / iPhone | ✅ VersaKey Companion iOS App | USB via Camera Adapter |
| Firefox (alle platforms) | ❌ Niet ondersteund | — |

> 💡 **iPad/iPhone nieuw in v2.5.0!** Zie sectie [iPad en iPhone gebruiken](#ipad-en-iphone-gebruiken) voor de stap-voor-stap instructies.

---

## 🛒 Wat heb je nodig?

### Windows of Android:
- Een computer (Windows 10/11) of Android-telefoon/tablet
- **Chrome** of **Edge** browser (gratis te downloaden)
- Optioneel: je **Devine VersaKey** keyboard (VK-25, VK-49, VK-61 of VK-88)
- Optioneel: een **USB-B kabel** (als bij een printer)
- De app: open `index.html` in je browser

### iPad of iPhone:
- iPad met USB-C poort (iPad 10e generatie of nieuwer) **of** iPhone 15 of nieuwer
- De **VersaKey Companion iOS App** (via TestFlight)
- Je **Devine VersaKey** keyboard
- Een **USB-B kabel** (meegeleverd met de VersaKey)
- Een **Apple USB Camera Adapter** (USB-A naar USB-C) — €29–€45 bij Apple of Bol.com

> 💡 **Oudere iPad met Lightning-aansluiting?** Gebruik de Apple Lightning naar USB Camera Adapter (ook €29).

> 💡 **Tip voor kinderen:** Je kunt de app ook gebruiken zonder keyboard! Klik gewoon op de piano-toetsen op het scherm.

---

## 🚀 Stap-voor-stap: De app starten

### Zonder VersaKey (alleen scherm-piano):
1. Open `index.html` in Chrome of Edge
2. Klik op een piano-toets → je hoort geluid! ✅

### Met VersaKey via USB-kabel (Windows of Android):
1. Sluit je VersaKey aan op de computer met de USB-kabel
2. Open `index.html` in **Chrome** of **Edge**
3. De browser vraagt: *"Wil je MIDI-toegang toestaan?"* → klik **Toestaan**
4. Rechtsboven zie je een groen bolletje 🟢 met de naam van je keyboard
5. Speel een toets op de VersaKey → de piano op het scherm reageert! ✅

> ⚠️ **Gebruik NOOIT Firefox** — die ondersteunt USB-MIDI niet.

### Met VersaKey op iPad of iPhone:
Zie de volgende sectie voor alle stappen.

---

## 📱 iPad en iPhone gebruiken *(Nieuw in v2.5.0)*

Apple's Safari ondersteunt geen USB MIDI — dat is een keuze van Apple, geen bug.
Wij lossen dit op met een eigen iOS app die de VersaKey direct leest via het
ingebouwde MIDI systeem van iOS (CoreMIDI). Dezelfde interface als op Windows en
Android — maar dan op je iPad of iPhone.

### Wat heb je nodig?

| Wat | Waar te koop |
|---|---|
| VersaKey 49 + USB-B kabel | Eigen bezit |
| Apple USB Camera Adapter (USB-A → USB-C) | Apple Store / Bol.com (€29–€45) |
| iPad 10e gen+ of iPhone 15+ (USB-C) | Eigen bezit |
| VersaKey Companion iOS App | Via TestFlight (zie stap 1) |

---

### Stap 1 — De iOS app installeren via TestFlight

TestFlight is Apple's officiele app om beta-apps te installeren. Het is gratis.

1. Open de **App Store** op je iPad of iPhone
2. Zoek op **"TestFlight"** en installeer de gratis TestFlight app
3. Open de uitnodigingslink die je ontvangen hebt voor de VersaKey Companion app
4. Klik **"Accepteer"** → de app installeert zich automatisch
5. Je ziet nu het VersaKey icoon op je home screen ✅

> ℹ️ Heb je nog geen uitnodigingslink? Neem contact op via de projectpagina.

---

### Stap 2 — De VersaKey aansluiten

Sluit de hardware aan in deze volgorde:

```
VersaKey 49
    │  USB-B kabel (meegeleverd)
    ▼
Apple USB Camera Adapter  (USB-A ingang)
    │  USB-C naar iPad
    ▼
iPad / iPhone
```

> ⚠️ **Batterij tip:** De VersaKey krijgt stroom van de iPad. Gebruik bij voorkeur
> een Camera Adapter **mét extra laadpoort** zodat je iPad tegelijk kan opladen.

---

### Stap 3 — De app starten en spelen

1. Open de **VersaKey Companion** app op je iPad
2. De app toont een blauwe banner: *"Sluit de VersaKey 49 aan via USB Camera Adapter"*
3. Zodra de VersaKey herkend wordt verdwijnt de banner automatisch ✅
4. Speel een toets op de VersaKey → de piano op het scherm reageert!

> 💡 **De app herkent de VersaKey automatisch** zodra je de kabel aansluit —
> ook als de app al open was.

---

### Wat werkt hetzelfde als op Windows?

Alles. De iOS app laadt exact dezelfde interface als de Windows/Android versie:

- ✅ Piano spelen — noten, velocity, aftertouch
- ✅ Rotary Encoders — alle 16 knopen (bank 1 en bank 2)
- ✅ Drum Pads — bank 1–8 en bank 9–16
- ✅ Touch Strips — Pitch Bend en Modulation
- ✅ MIDI Learn — encoders koppelen aan CC-nummers
- ✅ Zoom — piano groter of kleiner
- ✅ Alle instrumentgeluiden via Web Audio

---

### Veelgestelde vragen iOS

**Werkt het ook op een oudere iPad?**
Ja, als je iPad iOS 15 of nieuwer heeft (uitgebracht 2021). Oudere iPads met
Lightning-aansluiting hebben een Lightning naar USB Camera Adapter nodig.

**Moet internet aan staan?**
Nee. De app werkt volledig offline — alles is ingebakken in de app.

**Werkt het ook met VersaKey 25, 61 of 88?**
Ja. De app herkent alle VersaKey modellen op naam.

**De VersaKey wordt niet herkend — wat nu?**
1. Koppel de USB-kabel los en sluit hem opnieuw aan
2. Controleer of de Camera Adapter goed vastzit aan de iPad
3. Herstart de app
4. Zie ook de [troubleshooting sectie](#als-het-niet-werkt)

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
- **Aanraken** op telefoon/tablet/iPad werkt ook

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

## 🔍 Zoom — piano groter of kleiner *(Toegevoegd in v2.2.0)*

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

### Standaard koppelingen bank 1 (R1–R8):

| Knop | Naam | CC | Kleur |
|---|---|---|---|
| R1 | Program Change | CC131 | 🟠 Oranje |
| R2 | Volume | CC7 | 🟠 Oranje |
| R3 | Standard MIDI | CC92 | 🟢 Groen |
| R4 | Standard MIDI | CC81 | 🟢 Groen |
| R5 | Reverb Depth | CC91 | 🟣 Paars |
| R6 | Standard MIDI | CC67 | 🟣 Paars |
| R7 | Standard MIDI | CC86 | 🔵 Blauw |
| R8 | Chorus Depth | CC93 | ⚫ Grijs |

### Bank 2 (R9–R16):
Wissel naar bank 2 via de **"Wissel → R9–R16"** knop in de encoder-balk.
Bank 2 is volledig vrij programmeerbaar via de wizard of MIDI Learn.

> 💡 **R2 (Volume, CC7)** is speciaal: als je de knop op de VersaKey draait, beweegt ook de volume-schuifbalk in de topbar mee!

---

## 🎓 MIDI Learn — encoders koppelen *(Toegevoegd in v2.1.0)*

Heb je de VersaKey zo ingesteld dat een knop een ander CC-nummer stuurt? Dan kun je de app dat leren!

### Hoe werkt MIDI Learn?

1. **Klik** op de kleine CC-badge van een encoder (bijv. `CC131` naast R1)
   → het blokje begint te *pulsen* (knipperen) en wordt oranje
2. **Draai** de gewenste hardware-knop op je VersaKey
   → de app slaat de koppeling op! ✅
3. De badge toont nu het nieuwe CC-nummer

### Programmeer-wizard:
Klik op **"🎛️ Programmeer bank"** om alle 8 encoders van de actieve bank
stap voor stap te koppelen via de wizard.

### Reset Learn:
Klik op **"↺ Reset"** om alle koppelingen terug te zetten naar de fabriekswaarden.

> ℹ️ Wil je een learn-sessie annuleren? Klik nog een keer op de CC-badge van dezelfde encoder.

---

## 🥁 Drum Pads *(Uitgebreid in v2.6.0)*

16 programmeerbare pads verdeeld over 2 banken.

### Bank wisselen
Klik op **"Wissel → 9–16"** in de pad-balk om te wisselen tussen bank 1–8 en bank 9–16.

### Fabriekswaarden bank 1–8:
| Pad | Naam | MIDI Noot | Kleur |
|---|---|---|---|
| 1 | Kick | C2 (36) | 🔴 Rood |
| 2 | Snare | D2 (38) | 🟤 Bruin |
| 3 | Hi-Hat (gesloten) | F#2 (42) | 🔵 Blauw |
| 4 | Hi-Hat (open) | A#2 (46) | 🟢 Groen |
| 5 | Tom Laag | F2 (41) | 🟣 Paars |
| 6 | Tom Hoog | D3 (50) | 🟠 Oranje |
| 7 | Crash | C#3 (49) | 🔴 Rood |
| 8 | Ride | D#3 (51) | 🩵 Blauwgroen |

### Fabriekswaarden bank 9–16:
| Pad | Naam | MIDI Noot | Kleur |
|---|---|---|---|
| 9 | Clap | D#2 (39) | 🟠 Oranje |
| 10 | Rim Shot | C#2 (37) | 🔵 Blauw |
| 11 | Cowbell | G#3 (56) | 🟢 Groen |
| 12 | Tambourine | F#3 (54) | 🟣 Paars |
| 13 | High Bongo | C4 (60) | 🩵 Blauwgroen |
| 14 | Low Bongo | C#4 (61) | 🟤 Bruin |
| 15 | Agogo High | G4 (67) | 🔴 Rood |
| 16 | Agogo Low | G#4 (68) | 🟠 Oranje |

---

### Pad programmeren

**Editor openen:**
- **Lang indrukken** (600ms) op een pad → editor popup verschijnt
- **Rechtsklik** op een pad → editor popup verschijnt

**In de editor kun je instellen:**

| Instelling | Wat het doet |
|---|---|
| Naam | Naam op de pad (max 16 tekens) |
| Modus: Noot | Pad stuurt een MIDI noot — voor drums en samples |
| Modus: CC | Pad stuurt een Control Change — voor parameters zoals volume |
| MIDI Noot | Welke noot (bijv. C2, F#3) — typ of gebruik ▼ ▲ |
| MIDI Kanaal | Kanaal 1–16 (standaard kanaal 10 = GM drums) |
| CC Nummer | Nummer 0–127 voor de controller waarde |
| Kleur | 8 kleuren om pads visueel te organiseren |

### MIDI Learn voor pads

1. Open de editor van een pad (lang indrukken of rechtsklik)
2. Klik **"🎹 MIDI Learn noot"**
3. Er verschijnt een oranje banner onderaan: *"Sla pad X aan op de VersaKey…"*
4. Sla de gewenste pad aan op je VersaKey keyboard
5. De noot wordt automatisch gekoppeld ✅

Voor CC-modus: klik **"🎛 Learn CC"** en draai de gewenste knop.

### Pad terugzetten
Klik **"↺ Reset bank"** in de pad-balk om de volledige actieve bank
terug te zetten naar de fabriekswaarden.
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

### Windows en Android:

**Stap 1: Kabel aansluiten**
Sluit de USB-kabel aan van je VersaKey naar de computer.

**Stap 2: MIDI toestaan**
Chrome vraagt toestemming. Klik **"Toestaan"**.

**Stap 3: Apparaat kiezen**
Onder de topbar verschijnt een groene balk met een dropdown. Kies je VersaKey.
De app zoekt automatisch naar een apparaat met "versa" of "devine" in de naam.

**Stap 4: Genieten! 🎹**
Het groene bolletje 🟢 in de topbar toont dat je verbonden bent.

### iPad en iPhone:
Zie sectie [iPad en iPhone gebruiken](#ipad-en-iphone-gebruiken).

---

## 🆘 Als het niet werkt

### Windows en Android:

| Probleem | Oplossing |
|---|---|
| Geen geluid | Klik eerst ergens op het scherm (browser-vereiste voor audio) |
| "MIDI: niet ondersteund" | Gebruik Chrome of Edge — Firefox werkt niet! |
| "MIDI: geweigerd" | Klik op herladen en kies "Toestaan" bij de MIDI-vraag |
| Geen apparaat gevonden | Controleer de USB-kabel, sluit opnieuw aan, klik op het MIDI-bolletje |
| App laadt niet | Zorg dat `sw.js` en `manifest.json` in dezelfde map staan als `index.html` |
| Zoom werkt niet | Wis je browser-cache (Ctrl+Shift+R) om de nieuwe versie te laden |

### iPad en iPhone:

| Probleem | Oplossing |
|---|---|
| Blauwe banner verdwijnt niet | Koppel de USB-kabel los en sluit hem opnieuw aan |
| VersaKey niet herkend | Controleer of de Camera Adapter goed vastzit aan de iPad |
| Geen geluid | Tik eerst ergens op het scherm zodat audio geactiveerd wordt |
| App crasht bij aansluiten | Herstart de app en sluit de VersaKey dan pas aan |
| Banner verdwijnt maar geen MIDI | Sluit de kabel los, wacht 3 seconden, sluit opnieuw aan |
| iOS app niet beschikbaar | Controleer je TestFlight uitnodiging of vraag een nieuwe link aan |

---

## 📱 Installeren als app (PWA) — Windows en Android

Je kunt de webapp installeren als een echte app op je bureaublad of telefoon!

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

> ℹ️ iPad/iPhone gebruikers installeren de native app via TestFlight — geen PWA nodig.

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
| 🔴 Hoog | Encoder preset opslaan/laden (naam + alle 16 CC-koppelingen) |
| 🔴 Hoog | Pad-programmatie uitbreiden |
| 🟡 Middel | iOS app distribueren via TestFlight |
| 🟡 Middel | Pad kleuren aanpasbaar via UI |
| 🟡 Middel | Velocity curve instelling in UI |
| 🟢 Laag | Piano roll visualizer integreren in hoofdapp |
| 🟢 Laag | Dark mode |
| ⏸️ Gepauzeerd | AudioKit / Synth One J6 integratie |

---

## 📜 Versiegeschiedenis

| Versie | Datum | Wat is er nieuw? |
|---|---|---|
| **v2.6.0** | 2026-04-08 | ✅ Pad programmatie — noot, CC, kleur, naam, MIDI Learn per pad |
| **v2.5.0** | 2026-04-08 | ✅ iOS platform support — eigen Swift app voor iPad en iPhone |
| **v2.4.0** | 2026-04-06 | ✅ Dubbele encoder bank (R1–R16), programmeer-wizard, correcte fabrieks CC-nummers |
| **v2.3.0** | 2026-04-05 | ✅ CC Debug Monitor, help popup, waarden altijd zichtbaar |
| **v2.2.0** | 2026-04-05 | ✅ Zoom-knop piano en strips (3 niveaus, wordt onthouden) |
| **v2.1.0** | 2026-04-05 | ✅ Rotary Encoders met live CC-meters en MIDI Learn |
| **v2.0.0** | 2026-04-05 | ✅ USB-MIDI focus, J6 sectie verwijderd, versie-badge |
| **v1.x** | 2025 | Eerste versie met piano + drum pads |

---

*Gemaakt voor muzikanten, producers en techneuten die met de Devine VersaKey aan de slag willen. 🎵*
