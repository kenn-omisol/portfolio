const CACHE_NAME = 'kenn-omisol-portfolio-v2';
const urlsToCache = [
  '/index.html',
  '/css/styles.css',
  '/js/script.js'
];

// Silently handle errors and prevent console logs
const silentCacheAdd = async (cache, url) => {
  try {
    await cache.add(url);
  } catch (e) {
    // Silently ignore errors
  }
};

// Install event - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    (async () => {
      try {
        const cache = await caches.open(CACHE_NAME);
        // Add each URL individually and ignore errors
        await Promise.all(urlsToCache.map(url => silentCacheAdd(cache, url)));
        await self.skipWaiting();
      } catch (e) {
        // Silently ignore errors
      }
    })()
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== CACHE_NAME)
            .map(cacheName => caches.delete(cacheName))
        );
        await self.clients.claim();
      } catch (e) {
        // Silently ignore errors
      }
    })()
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip non-HTTP(S) requests
  if (!event.request.url.startsWith('http')) return;
  
  event.respondWith(
    (async () => {
      try {
        // Try cache first
        const cachedResponse = await caches.match(event.request);
        if (cachedResponse) return cachedResponse;

        // Otherwise try network
        try {
          const networkResponse = await fetch(event.request);
          
          // Only cache successful responses from our own origin
          if (
            networkResponse.ok && 
            event.request.url.startsWith(self.location.origin) &&
            !event.request.url.includes('/api/')
          ) {
            try {
              const cache = await caches.open(CACHE_NAME);
              cache.put(event.request, networkResponse.clone());
            } catch (e) {
              // Silently ignore cache errors
            }
          }
          
          return networkResponse;
        } catch (e) {
          // Network failed, try to return something useful
          if (event.request.url.endsWith('.html') || event.request.mode === 'navigate') {
            const cache = await caches.open(CACHE_NAME);
            return cache.match('/index.html');
          }
          // Otherwise just let the error happen
          throw e;
        }
      } catch (e) {
        // Last resort fallback
        return new Response('Network error', { status: 408, headers: { 'Content-Type': 'text/plain' } });
      }
    })()
  );
}); 