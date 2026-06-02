const CACHE_NAME = 'cavai-high-impact-v2';

const CACHE_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './assets/fonts/lato-300.ttf',
  './assets/fonts/unbounded-300.ttf',
  './assets/fonts/unbounded-500.ttf',
  './assets/andreas-akesson.jpeg',
  './assets/cavai-logo.svg',
  './assets/favicon.ico',
  './assets/image1.png',
  './assets/image3.png',
  './assets/image4.gif',
  './assets/image6.gif',
  './assets/image7.gif',
  './assets/image8.png',
  './assets/image9.jpg',
  './assets/image10.gif',
  './assets/image11.gif',
  './assets/image12.gif',
  './assets/image13.png',
  './assets/image14.png',
  './assets/image15.png',
  './assets/image20.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put('./index.html', copy));
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        return response;
      });
    })
  );
});
