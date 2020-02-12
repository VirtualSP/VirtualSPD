var CACHE_NAME = 'VSPcache1.8.2.1';
var urlsToCache = [
    'https://virtualsp.github.io/VirtualSPD/',
    'https://virtualsp.github.io/VirtualSPD/js/app66.js',
    'https://virtualsp.github.io/VirtualSPD/js/three.min.js',
     'https://virtualsp.github.io/VirtualSPD/js/musicmetadata.js'
];

self.addEventListener('install', function(event) {
    event.waitUntil(caches
        .open(CACHE_NAME)
        .then(function(cache) {
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', function(event) {
    event.respondWith(caches
        .match(event.request)
        .then(function(response) {
            return response ? response : fetch(event.request);
        })
    );
});



self.addEventListener('activate', function(event) {
  event.waitUntil(
    (function() {
      caches.keys().then(function(oldCacheKeys) {
        oldCacheKeys
          .filter(function(key) {
            return key !== CACHE_NAME;
          })
          .map(function(key) {
            return caches.delete(key);
          });
      });
      clients.claim();
    })()
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    (function() {
      caches.keys().then(function(oldCacheKeys) {
        oldCacheKeys
          .filter(function(key) {
            return key !== CACHE_NAME;
          })
          .map(function(key) {
            return caches.delete(key);
          });
      });
      clients.claim();
    })()
  );
});