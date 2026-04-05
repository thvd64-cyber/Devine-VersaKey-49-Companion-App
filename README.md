# Devine VersaKey — Companion App
**Versie:** 2.0.0 | **Datum:** 2026-04-05  
**Platform:** Windows + Android + Chrome/Edge via USB-kabel

---

## Wat is dit?

Een Progressive Web App (PWA) die werkt als companion voor het **Devine VersaKey MIDI keyboard**.  
De app ontvangt MIDI-signalen via de USB-kabel en toont ze visueel, zodat je ook geluid hoort in de browser.

## Welke modellen worden ondersteund?

| Model | Toetsen | Startoctaaf |
|---|---|---|
| VK-25 | 25 | C3 |
| VK-49 | 49 | C2 |
| VK-61 | 61 | C2 |
| VK-88 | 88 | A0 |

## Installatie (zo makkelijk als 1-2-3!)

### Stap 1: Verbind de VersaKey
Sluit het VersaKey keyboard aan op je computer of telefoon met de **USB-kabel**.

### Stap 2: Open de app in Chrome
Op Windows of Android, open **Google Chrome** of **Microsoft Edge** en ga naar de app-URL.

> ⚠️ Firefox en Safari werken **niet** met USB-MIDI!

### Stap 3: Sta MIDI toe
Als de browser vraagt "Wil je MIDI-toegang toestaan?" → klik **Toestaan**.

### Stap 4: Speel!
Het keyboard wordt automatisch herkend. Speel een noot en je hoort geluid!

---

## Installeren als app (PWA)

### Op Windows (Chrome):
1. Open de app in Chrome
2. Klik het **+** icoontje rechts in de adresbalk
3. Klik "Installeren"
4. De app staat nu op je bureaublad!

### Op Android (Chrome):
1. Open de app in Chrome
2. Tik het menu (⋮) → "Toevoegen aan beginscherm"
3. Klaar!

---

## Bestandsstructuur

```
index.html      ← Hoofdapp (v2.0 - schoon, zonder J6)
visualizer.html ← Piano roll visualizer (apart)
manifest.json   ← PWA instellingen
sw.js           ← Service Worker (offline werking)
CHANGELOG.md    ← Versiehistorie
```

---

## Browser ondersteuning

| Browser | Platform | USB-MIDI | Status |
|---|---|---|---|
| Chrome 90+ | Windows | ✅ | Aanbevolen |
| Edge 90+ | Windows | ✅ | Aanbevolen |
| Chrome 90+ | Android | ✅ (USB-OTG) | Aanbevolen |
| Firefox | Alle | ❌ | Niet ondersteund |
| Safari | iOS/macOS | ❌ | Niet ondersteund |
