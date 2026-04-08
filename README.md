# VersaKey Companion — iOS App · Setup Instructies

Versie: 1.0.0 | Datum: 2026-04-07

## Wat zit er in dit pakket?

| Bestand | Functie |
|---|---|
| `MIDIManager.swift` | CoreMIDI verbinding — detecteert en leest de VersaKey |
| `ViewController.swift` | WKWebView + JavaScript bridge naar index.html |
| `AppDelegate.swift` | App lifecycle en audio sessie configuratie |
| `SceneDelegate.swift` | Venster aanmaken (iOS 13+) |
| `Info.plist` | App rechten — USB MIDI + achtergrond audio |
| `midi-ios-bridge.js` | JavaScript polyfill — simuleert Web MIDI API |

---

## Stap 1 — Xcode project aanmaken

1. Open Xcode → **File → New → Project**
2. Kies **iOS → App**
3. Instellingen:
   - Product Name: `VersaKeyCompanion`
   - Bundle Identifier: `com.devine.versakeycompanion`
   - Interface: **Storyboard** (NIET SwiftUI)
   - Language: **Swift**
4. Klik **Next** en sla op

---

## Stap 2 — Swift bestanden toevoegen

1. Verwijder de automatisch aangemaakte `ViewController.swift` en `AppDelegate.swift`
2. Sleep de meegeleverde bestanden naar het project:
   - `MIDIManager.swift`
   - `ViewController.swift`
   - `AppDelegate.swift`
   - `SceneDelegate.swift`
3. Zorg dat **"Add to target: VersaKeyCompanion"** aangevinkt is bij elk bestand

---

## Stap 3 — WebApp map aanmaken

1. Maak een **New Group** aan in Xcode: klik rechts op project → **New Group** → naam: `WebApp`
2. Sleep de volgende bestanden naar de `WebApp` groep:
   - `index.html` (jouw bestaande Companion App)
   - `midi-ios-bridge.js` (uit dit pakket)
   - `sw.js` (jouw bestaande service worker)
   - `manifest.json` (jouw bestaande manifest)
3. Bij het toevoegen: vink **"Add to target"** aan én kies **"Create folder references"**
   (zodat de mapstructuur bewaard blijft)

---

## Stap 4 — Info.plist instellen

1. Klik op het project in de navigator
2. Selecteer het **VersaKeyCompanion target**
3. Ga naar het tabblad **Info**
4. Voeg toe via het **+** knopje:

| Sleutel | Type | Waarde |
|---|---|---|
| Required background modes | Array | `App plays audio or streams audio/video using AirPlay` |
| Privacy - Microphone Usage Description | String | `VersaKey Companion gebruikt audio voor het weergeven van MIDI geluiden.` |

Of: vervang de bestaande `Info.plist` met het meegeleverde bestand.

---

## Stap 5 — Frameworks toevoegen

1. Selecteer het **VersaKeyCompanion target**
2. Ga naar **General → Frameworks, Libraries, and Embedded Content**
3. Klik **+** en voeg toe:
   - `CoreMIDI.framework`
   - `WebKit.framework`
   - `AVFoundation.framework`

---

## Stap 6 — Compileren en testen

### Op een echte iPad (aanbevolen):
1. Verbind de iPad met de Mac via USB
2. Selecteer de iPad als build target in Xcode
3. Klik **Run** (▶)
4. Vertrouw de developer op de iPad: **Instellingen → Algemeen → VPN & Apparaatbeheer**
5. Sluit de VersaKey aan via de Apple USB Camera Adapter
6. De app detecteert de VersaKey automatisch — speel een noot!

### In de Simulator (beperkt):
De iOS Simulator ondersteunt geen USB MIDI hardware.
Je kunt de app wel testen met de debug console:
```javascript
// In Safari Web Inspector (verbonden met de simulator):
window.__iOSMIDIDebug.noteOn(60, 80)   // Simuleer Note On C4
window.__iOSMIDIDebug.cc(7, 64)        // Simuleer Volume CC
window.__iOSMIDIDebug.status()         // Toon bridge status
```

---

## Stap 7 — Distribueren via TestFlight

1. Selecteer **Any iOS Device** als build target
2. **Product → Archive**
3. In Xcode Organizer: klik **Distribute App**
4. Kies **TestFlight & App Store**
5. Volg de stappen — de app verschijnt in App Store Connect
6. Voeg testers toe via TestFlight in App Store Connect
7. Testers ontvangen een e-mail met een uitnodigingslink

---

## Hardware die de gebruiker nodig heeft

| Hardware | Waar te koop |
|---|---|
| Devine VersaKey 49 | Eigen bezit |
| USB-B naar USB-A kabel | Meegeleverd met VersaKey |
| Apple USB Camera Adapter (USB-A naar USB-C) | Apple Store, Bol.com (€29–€45) |
| iPad met USB-C (iPad 10e gen+) of iPhone 15+ | Eigen bezit |

**Oudere iPad met Lightning aansluiting:**
Gebruik de Apple Lightning naar USB Camera Adapter (€29).

---

## Veelgestelde vragen

**Werkt het ook op iPhone?**
Ja. Dezelfde app werkt op iPhone. Het scherm is kleiner maar volledig functioneel.

**Moet de internet aan staan?**
Nee. De app laadt index.html volledig lokaal uit de app bundle.

**Wat als de VersaKey niet herkend wordt?**
1. Controleer of de USB Camera Adapter goed aangesloten is
2. Koppel de VersaKey los en weer aan
3. Herstart de app

**Werkt dit ook met de VersaKey 25, 61 of 88?**
Ja. De herkenning is op naam gebaseerd. Alle VersaKey modellen worden herkend.
