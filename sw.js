var CACHE_NAME = 'VSPcache';
var urlsToCache = [
    'https://virtualsp.github.io/VirtualSPD/',
    '/js/app66.js',
    '/js/three.min.js',
     '/js/musicmetadata.js'
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