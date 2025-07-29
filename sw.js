self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('app-cache-v1').then(cache => {
      return cache.addAll([
        './',
        'https://engdau.vercel.app/eng-dau.html',
        'https://raw.githubusercontent.com/contactluva/bird70/refs/heads/main/manifest.json',
        'https://raw.githubusercontent.com/contactluva/bird70/refs/heads/main/dau2.png',
        'https://raw.githubusercontent.com/contactluva/bird70/refs/heads/main/dau.png'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
