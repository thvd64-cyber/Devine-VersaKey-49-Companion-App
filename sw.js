/* SERVICE WORKER — Devine VersaKey v2.4.0  2026-04-06
   CHANGELOG v2.4.0:
   Cache versakey-v6 (vervangt v5)
   Reden: dubbele encoder bank + fabrieks CC-nummers + wizard 
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

const CACHE = 'versakey-v6';
const FILES = ['./', './index.html', './manifest.json', './visualizer.html',
               './icon-192.svg', './icon-512.svg', './CHANGELOG.md'];

self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE).then(function(c) { return c.addAll(FILES); }));
  self.skipWaiting();
});
self.addEventListener('activate', function(e) {
  e.waitUntil(caches.keys().then(function(keys) {
    return Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
  }));
  self.clients.claim();
});
self.addEventListener('fetch', function(e) {
  e.respondWith(caches.match(e.request).then(function(cached) {
    if (cached) return cached;
    return fetch(e.request).then(function(r) {
      if (!r || r.status !== 200 || r.type !== 'basic') return r;
      var clone = r.clone();
      caches.open(CACHE).then(function(c) { c.put(e.request, clone); });
      return r;
    }).catch(function() { return caches.match('./index.html'); });
  }));
});
