/* ================================================================
   SERVICE WORKER — Devine VersaKey Companion App
   VERSIE  : 2.0.0
   DATUM   : 2026-04-05
   DOEL    : Zorgt dat de app ook werkt zonder internet (offline PWA)
             en dat bestanden snel laden vanuit de cache

   WAT IS EEN SERVICE WORKER?
   Een service worker is een onzichtbaar hulpprogramma dat de browser
   op de achtergrond draait. Het werkt als een tussenpersoon tussen
   de app en het internet:
     Pagina → Service Worker → Cache / Internet

   CHANGELOG v2.0.0:
   - Cache-naam bijgewerkt naar 'versakey-v2' (vervangt v1 automatisch)
   - visualizer.html toegevoegd aan de cache
   - CHANGELOG.md toegevoegd aan de cache
   - Inline uitleg toegevoegd bij elke coderegel
   ================================================================ */

/* ── CACHE NAAM ──────────────────────────────────────────────────
   De naam van onze opslagplaats in de browser.
   BELANGRIJK: verander dit bij elke update (v1→v2→v3...).
   De oude cache wordt dan automatisch verwijderd door de activate-stap. */
const CACHE = 'versakey-v2';

/* ── BESTANDEN DIE WE OPSLAAN IN DE CACHE ────────────────────────
   Dit zijn alle bestanden die de app nodig heeft om te werken.
   Ze worden bij installatie één keer gedownload en daarna bewaard.
   Zo werkt de app ook zonder internetverbinding. */
const FILES = [
  './',              /* De map zelf (laadt index.html als startpagina) */
  './index.html',    /* Hoofdpagina van de app (piano + drum pads) */
  './manifest.json', /* PWA-instellingen (naam, icoon, kleur, etc.) */
  './visualizer.html', /* Aparte piano roll visualizer pagina */
  './icon-192.svg',  /* Klein app-icoon (192×192 pixels) voor telefoon */
  './icon-512.svg',  /* Groot app-icoon (512×512 pixels) voor installatie */
  './CHANGELOG.md'   /* Versiegeschiedenis (handig bij debuggen) */
];

/* ── INSTALLATIE FASE ────────────────────────────────────────────
   Wordt uitgevoerd als de service worker voor het eerst geladen wordt,
   of als de code van sw.js veranderd is (= nieuwe versie).
   Taak: download alle bestanden uit FILES en sla ze op in de cache. */
self.addEventListener('install', function(e) {

  /* e.waitUntil() zegt: "wacht tot dit klaar is voor je verder gaat"
     Zo weet de browser dat de installatie nog bezig is */
  e.waitUntil(

    /* Open (of maak aan) een cache met de naam 'versakey-v2' */
    caches.open(CACHE).then(function(cache) {

      console.log('[SW v2.0] Bestanden opslaan in cache:', FILES);

      /* Download alle bestanden en sla ze op in de cache
         Als één bestand mislukt, mislukt de hele installatie */
      return cache.addAll(FILES);
    })
  );

  /* skipWaiting() = activeer de nieuwe service worker meteen,
     ook als de oude versie nog actief is op andere tabbladen.
     Zonder dit wacht de nieuwe versie tot alle tabbladen gesloten zijn. */
  self.skipWaiting();
});

/* ── ACTIVATIE FASE ──────────────────────────────────────────────
   Wordt uitgevoerd nadat de installatie klaar is.
   Taak: verwijder alle oude caches (van vorige versies zoals v1).
   Zo voorkom je dat de browser vol raakt met oude bestanden. */
self.addEventListener('activate', function(e) {

  e.waitUntil(

    /* Haal de namen op van alle bestaande caches in de browser */
    caches.keys().then(function(keys) {

      console.log('[SW v2.0] Gevonden caches:', keys);

      /* Verwijder alle caches waarvan de naam NIET gelijk is aan onze huidige naam.
         Dit verwijdert automatisch 'versakey-v1' als we nu op 'versakey-v2' zitten. */
      return Promise.all(
        keys
          .filter(function(k) { return k !== CACHE; }) /* Bewaar alleen de huidige cache */
          .map(function(k) {
            console.log('[SW v2.0] Oude cache verwijderd:', k);
            return caches.delete(k); /* Verwijder de oude cache */
          })
      );
    })
  );

  /* clients.claim() = neem direct de controle over alle open tabbladen.
     Zonder dit geldt de nieuwe service worker pas bij het volgende bezoek. */
  self.clients.claim();
});

/* ── FETCH (NETWERK-VERZOEK) FASE ────────────────────────────────
   Wordt uitgevoerd bij ELKE netwerkaanvraag die de app doet:
   een HTML-bestand laden, een lettertype, een afbeelding, etc.

   Strategie: "Cache First, dan Netwerk"
   1. Kijk eerst in de cache → snel, werkt offline
   2. Zit het er niet in? Haal het op van het internet
   3. Sla het dan ook op in de cache voor de volgende keer
   4. Lukt het internet ook niet? Toon de index.html als noodpagina */
self.addEventListener('fetch', function(e) {

  /* e.respondWith() onderschept het verzoek en bepaalt wat we terugsturen */
  e.respondWith(

    /* Zoek het gevraagde bestand in onze cache */
    caches.match(e.request).then(function(cached) {

      /* Gevonden in cache? Stuur het direct terug (snel!) */
      if (cached) {
        console.log('[SW v2.0] Uit cache:', e.request.url);
        return cached;
      }

      /* Niet in cache: haal het op van het internet */
      console.log('[SW v2.0] Van internet:', e.request.url);
      return fetch(e.request).then(function(response) {

        /* Controleer of het antwoord geldig is:
           - response moet bestaan
           - status 200 = succesvol (niet 404 of 500)
           - type 'basic' = zelfde domein (geen externe API-aanroepen opslaan) */
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response; /* Sla het niet op, stuur gewoon terug */
        }

        /* Kloon het antwoord: je kunt een netwerk-antwoord maar één keer lezen.
           We hebben twee kopieën nodig: één voor de cache, één voor de pagina. */
        var clone = response.clone();

        /* Sla de kloon op in de cache voor volgende keer */
        caches.open(CACHE).then(function(cache) {
          cache.put(e.request, clone);
        });

        /* Stuur het originele antwoord terug naar de pagina */
        return response;

      }).catch(function() {
        /* Internet werkt niet EN bestand zit niet in cache:
           Toon de hoofdpagina als noodoplossing (offline fallback) */
        console.warn('[SW v2.0] Offline fallback: index.html getoond');
        return caches.match('./index.html');
      });
    })
  );
});
