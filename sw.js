var CACHE_NAME = 'VSPcache1822';
var urlsToCache = [
    '/index.html',
    '/js/app66.js',
    '/js/three.min.js',
    '/js/musicmetadata.js',
   
     '/js/icon_128.png'

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