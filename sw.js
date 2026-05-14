const CACHE_NAME = 'money-lab-v3';

self.addEventListener('install', e => {
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => caches.delete(k)))
    )
  );
  clients.claim();
});

self.addEventListener('fetch', e => {
  // Network first - sempre tenta buscar do servidor
  e.respondWith(
    fetch(e.request)
      .then(response => {
        // Salva no cache só depois de buscar do servidor
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        return response;
      })
      .catch(() => {
        // Só usa cache se estiver offline
        return caches.match(e.request);
      })
  );
});
