// GER-ITA-SUI – Offline-Speicher. Mit Internet: immer die neueste Fassung laden und merken.
// Ohne Internet: die zuletzt gemerkte Fassung zeigen.
const CACHE = "gis-v1";
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => { e.waitUntil(self.clients.claim()); });
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;
  e.respondWith(
    fetch(req).then(res => {
      if (res.ok){ const copy = res.clone(); caches.open(CACHE).then(c => c.put(req.mode === "navigate" ? "./index.html" : req, copy)); }
      return res;
    }).catch(() => caches.match(req.mode === "navigate" ? "./index.html" : req, { ignoreSearch: true }).then(r => r || caches.match("./index.html")))
  );
});
