/* ================================================================
   SERVICE WORKER — Devine VersaKey Companion App
   VERSIE  : 2.3.0
   DATUM   : 2026-04-05

   CHANGELOG v2.3.0:
   - Cache-naam bijgewerkt naar 'versakey-v5' (vervangt v4 automatisch)
   - Reden: index.html gewijzigd (CC Debug Monitor + encoder fixes + help popup)

   CHANGELOG v2.2.0:
   - Cache-naam bijgewerkt naar 'versakey-v4'
   - Reden: zoom-functie piano + strips toegevoegd

   CHANGELOG v2.1.0:
   - Cache-naam bijgewerkt naar 'versakey-v3'
   - Reden: rotary encoder sectie toegevoegd

   CHANGELOG v2.0.0:
   - Cache-naam bijgewerkt naar 'versakey-v2'
   ================================================================ */

/* ── CACHE NAAM ──────────────────────────────────────────────────
   BELANGRIJK: verhoog dit nummer bij ELKE update van de app-bestanden.
   versakey-v1 = app v1.x
   versakey-v2 = app v2.0
   versakey-v3 = app v2.1
   versakey-v4 = app v2.2
   versakey-v5 = app v2.3 (CC Debug Monitor + encoder fixes) */
const CACHE = 'versakey-v5';

/* ── BESTANDEN IN DE CACHE ───────────────────────────────────────
   Alle bestanden die de app nodig heeft om offline te werken. */
const FILES = [
  './',
  './index.html',
  './manifest.json',
  './visualizer.html',
  './icon-192.svg',
  './icon-512.svg',
  './CHANGELOG.md'
];

/* ── INSTALLATIE FASE ────────────────────────────────────────────
   Download en sla alle bestanden op in de cache bij eerste start. */
self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      console.log('[SW v2.3] Bestanden opslaan in cache:', FILES);
      return cache.addAll(FILES);
    })
  );
  self.skipWaiting(); /* Activeer meteen, wacht niet op oude tabbladen */
});

/* ── ACTIVATIE FASE ──────────────────────────────────────────────
   Verwijder oude caches (versakey-v4 en ouder). */
self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys
          .filter(function(k) { return k !== CACHE; }) /* Bewaar alleen de huidige cache */
          .map(function(k) {
            console.log('[SW v2.3] Oude cache verwijderd:', k);
            return caches.delete(k);
          })
      );
    })
  );
  self.clients.claim(); /* Neem direct controle over alle open tabbladen */
});

/* ── FETCH (NETWERK-VERZOEK) FASE ────────────────────────────────
   Strategie: Cache First, dan Netwerk.
   1. Zoek in cache → snel, werkt offline
   2. Niet in cache? Haal op van internet
   3. Sla op in cache voor volgende keer
   4. Offline + niet in cache? Toon index.html als noodpagina */
self.addEventListener('fetch', function(e) {
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      if (cached) return cached; /* Uit cache: snel! */

      return fetch(e.request).then(function(response) {
        /* Sla alleen geldige antwoorden van hetzelfde domein op */
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        var clone = response.clone(); /* Kloon nodig: antwoord kan maar 1x gelezen worden */
        caches.open(CACHE).then(function(cache) { cache.put(e.request, clone); });
        return response;

      }).catch(function() {
        /* Offline fallback: toon de hoofdpagina */
        console.warn('[SW v2.3] Offline fallback: index.html');
        return caches.match('./index.html');
      });
    })
  );
});
