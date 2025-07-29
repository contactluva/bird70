self.addEventListener('install', (e) => {
  console.log('[ServiceWorker] Installed');
  e.waitUntil(
    caches.open('engdau-cache-v1').then((cache) => {
      return cache.addAll([
        '/eng-dau.html',
        '/manifest.json',
         "https://raw.githubusercontent.com/contactluva/bird70/main/dau.png",
  "https://raw.githubusercontent.com/contactluva/bird70/main/dau2.png"
      ]);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});


