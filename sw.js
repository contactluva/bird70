const CACHE_NAME = "english-practice-v2";

const urlsToCache = [
  "https://contactluva.github.io/bird70/eng-dau.html",
  "https://raw.githubusercontent.com/contactluva/bird70/main/dau.png",
  "https://raw.githubusercontent.com/contactluva/bird70/main/dau2.png",
  "https://raw.githubusercontent.com/contactluva/bird70/main/manifest.json"
];

// ✅ Install event: Cache resources
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
  self.skipWaiting(); // update SW immediately
});

// ✅ Activate event: Clean up old caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim(); // take control immediately
});

// ✅ Fetch event: Serve from cache, fall back to network
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
