const CACHE_NAME = 'cavai-high-impact-v101';

const CACHE_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './assets/fonts/lato-300.ttf',
  './assets/fonts/unbounded-300.ttf',
  './assets/fonts/unbounded-500.ttf',
  './assets/andreas-akesson.png',
  './assets/cavai-logo.svg',
  './assets/doggo0.png',
  './assets/doggo1.png',
  './assets/favicon.ico',
  './assets/image4.gif',
  './assets/image6.gif',
  './assets/image10.gif',
  './assets/image12.gif',
  './assets/image20.png',
  './assets/star.png',
  './assets/brand-logos/adidas.svg',
  './assets/brand-logos/azerion.svg',
  './assets/brand-logos/barclays.svg',
  './assets/brand-logos/bmw.png',
  './assets/brand-logos/carrefour.svg',
  './assets/brand-logos/clear-channel.svg',
  './assets/brand-logos/coca-cola.svg',
  './assets/brand-logos/cupra.svg',
  './assets/brand-logos/deliveroo.svg',
  './assets/brand-logos/dia.svg',
  './assets/brand-logos/disney.svg',
  './assets/brand-logos/edf.svg',
  './assets/brand-logos/honda.webp',
  './assets/brand-logos/illumin.png',
  './assets/brand-logos/isdin.svg',
  './assets/brand-logos/jbl.svg',
  './assets/brand-logos/jet2.svg',
  './assets/brand-logos/caixabank.png',
  './assets/brand-logos/loreal.svg',
  './assets/brand-logos/mahou-san-miguel.svg',
  './assets/brand-logos/marketplats.svg',
  './assets/brand-logos/mcdonalds.svg',
  './assets/brand-logos/mercedes.png',
  './assets/brand-logos/nestle.svg',
  './assets/brand-logos/netflix.svg',
  './assets/brand-logos/nike.png',
  './assets/brand-logos/nivea.svg',
  './assets/brand-logos/nordea.svg',
  './assets/brand-logos/odigeo.svg',
  './assets/brand-logos/pando.svg',
  './assets/brand-logos/perrigo.svg',
  './assets/brand-logos/reckitt.svg',
  './assets/brand-logos/sony.svg',
  './assets/brand-logos/square.svg',
  './assets/brand-logos/tv2.svg',
  './assets/brand-logos/unilever.svg',
  './assets/brand-logos/wpp-media.svg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => Promise.all(
        CACHE_ASSETS.map((asset) => (
          fetch(new Request(asset, { cache: 'reload' }))
            .then((response) => cache.put(asset, response))
        ))
      ))
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
