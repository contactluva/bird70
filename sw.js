self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('app-cache-v1').then(cache => {
      return cache.addAll([
        './',
        'https://engdau.vercel.app/eng-dau.html',
        './manifest.json',
        'https://github.com/contactluva/bird70/blob/main/dau2.png',
        'https://github.com/contactluva/bird70/blob/main/dau.png'
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
