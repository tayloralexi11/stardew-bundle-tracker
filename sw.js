/* Stardew Bundle Tracker — service worker (offline support)
   Bump CACHE when you change core files to push updates to installed apps. */
const CACHE = "sdv-tracker-v4";
const CORE = [
  "./", "./index.html", "./styles.css", "./app.js",
  "./data.js", "./data-npcs.js", "./data-crops.js",
  "./manifest.json", "./icon-192.png", "./icon-512.png",
  "./apple-touch-icon.png", "./images/junimo.gif"
];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE).catch(() => {})));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  // Item sprites & Google Fonts: cache-first (they never change)
  const cacheFirst = url.pathname.includes("/images/") ||
                     url.hostname.includes("fonts.googleapis.com") ||
                     url.hostname.includes("fonts.gstatic.com");

  if (cacheFirst) {
    e.respondWith(
      caches.match(req).then((hit) =>
        hit || fetch(req).then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        }).catch(() => hit)
      )
    );
    return;
  }

  // App shell (html/js/css): network-first so updates appear, fall back to cache offline
  e.respondWith(
    fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((c) => c.put(req, copy));
      return res;
    }).catch(() => caches.match(req).then((hit) => hit || caches.match("./index.html")))
  );
});
