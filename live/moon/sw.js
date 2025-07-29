const CACHE_NAME = 'lunar-cache-v1';
const FILES_TO_CACHE = [
  '/',
  './live/moon/index.html',
  './live/moon/moon_style.css',
  './live/moon/moon_script.js',
  './live/moon/moon_data.json',
  './live/moon/icon-192x192.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});