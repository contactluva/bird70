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

const EXPIRATION_TIME = 5 * 60 * 1000; // 5 phút tính bằng milliseconds

// Khi cài đặt service worker
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Bắt buộc kích hoạt ngay
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(FILES_TO_CACHE);
    }).then(() => {
      return self.registration.storage.persist(); // Đảm bảo dữ liệu tồn tại lâu dài nếu được
    })
  );
});

// Khi kích hoạt, kiểm tra và xoá cache cũ nếu hết hạn
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map(async (key) => {
          if (key !== CACHE_NAME) {
            await caches.delete(key);
          }
        })
      );
    })()
  );
  self.clients.claim();
});

// Fetch với auto cache-busting sau 5 phút
self.addEventListener('fetch', (event) => {
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(event.request);
      const now = Date.now();

      // Check nếu có metadata thời gian
      const timestamp = await getTimestampFromCache(event.request);

      // Nếu có cache nhưng quá 5 phút thì xoá và fetch lại
      if (cachedResponse && timestamp && (now - timestamp > EXPIRATION_TIME)) {
        await cache.delete(event.request);
      }

      // Nếu chưa có hoặc đã xóa → fetch mới
      let response = await cache.match(event.request);
      if (!response) {
        response = await fetch(event.request);
        if (response && response.ok) {
          cache.put(event.request, response.clone());
          await saveTimestampToCache(event.request, now);
        }
      }
      return response;
    })()
  );
});

// Lưu thời gian lưu cache
async function saveTimestampToCache(request, timestamp) {
  const metadataCache = await caches.open('metadata');
  await metadataCache.put(
    new Request(request.url + ':timestamp'),
    new Response(timestamp.toString())
  );
}

// Lấy thời gian lưu cache
async function getTimestampFromCache(request) {
  const metadataCache = await caches.open('metadata');
  const response = await metadataCache.match(request.url + ':timestamp');
  if (!response) return null;
  const text = await response.text();
  return parseInt(text);
}

