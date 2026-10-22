// Bump CACHE whenever any shipped file changes, or returning players keep
// running the old version. verify.py checks this against origin/main.
const CACHE = "bumpuzzled-v23";
const ASSETS = ["./", "./index.html", "./game-core.js", "./levels.js", "./manifest.webmanifest", "./icon.svg", "./icon-192.png", "./icon-512.png",
  "./icon-maskable-512.png", "./apple-touch-icon.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Network first, cache as fallback: online players always get the latest
// version, offline players still get the last one they loaded. "no-cache"
// makes the browser re-check with the server instead of trusting its own
// HTTP cache, so a fresh index.html never runs with a stale levels.js.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET" || new URL(e.request.url).origin !== location.origin) return;
  e.respondWith(
    fetch(e.request.url, { cache: "no-cache" }).then(resp => {
      if (resp.ok) {
        const copy = resp.clone();
        caches.open(CACHE).then(c => c.put(e.request, copy));
      }
      return resp;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
