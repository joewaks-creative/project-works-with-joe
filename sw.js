// Enhanced Service Worker for Digital Heritage PWA
const CACHE_NAME = 'digital-heritage-v2';
const OFFLINE_URL = './index.html';

// Dynamic cache for runtime resources
const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v1';

const STATIC_ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './manifest.json',
  './images/icon-192.png',
  './images/icon-512.png',
  './images/joe_added.png',
  './images/san1.png',
  './images/adwo-medium copy.png',
  './images/mtn.png',
  './offline vidoes/2026-03-11 17-56-03.mp4',
  './offline vidoes/2026-03-11 20-07-42.mp4',
  './offline vidoes/2026-03-11 20-17-59.mp4'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[SW] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
          .map(name => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) return;

  // Handle different types of requests
  if (isStaticAsset(url.pathname)) {
    // Static assets - cache first
    event.respondWith(cacheFirst(request));
  } else if (isApiRequest(url)) {
    // API requests - network only
    event.respondWith(networkOnly(request));
  } else {
    // Dynamic content - network first with cache fallback
    event.respondWith(networkFirst(request));
  }
});

// Check if request is for static asset
function isStaticAsset(pathname) {
  const staticExtensions = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.woff', '.woff2'];
  return staticExtensions.some(ext => pathname.endsWith(ext));
}

// Check if request is API
function isApiRequest(url) {
  return url.pathname.startsWith('/api/');
}

// Cache first strategy
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return caches.match('./images/icon-192.png');
  }
}

// Network first strategy
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return caches.match(OFFLINE_URL);
  }
}

// Network only strategy
async function networkOnly(request) {
  return fetch(request);
}

// Handle push notifications
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Continue your digital literacy journey!',
    icon: './images/icon-192.png',
    badge: './images/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
      url: './#modules'
    },
    actions: [
      {
        action: 'continue',
        title: 'Continue Learning'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Digital Heritage', options)
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.action === 'continue' || !event.action) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});

// Background sync for offline progress
self.addEventListener('sync', event => {
  if (event.tag === 'sync-progress') {
    event.waitUntil(syncProgress());
  }
});

async function syncProgress() {
  // Sync progress when back online
  console.log('[SW] Syncing progress...');
}
