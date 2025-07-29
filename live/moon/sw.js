const CACHE_NAME = 'moon-cache-v2';
const STATIC_FILES = [
  './moon_calendar.html',
  './moon_style.css',
  './moon_script.js',
  './moon_data.json',
  './icon-192x192.png'
];

// Установка и кеширование
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_FILES))
  );
});

// Стратегия: Сначала кеш, потом сеть
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request)
      .then(cached => cached || fetch(e.request))
  );
});