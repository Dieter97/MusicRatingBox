var CACHE_NAME = 'music-rating-box-cache-v1';
var urlsToCache = [
    './pages/login/login.html',
    './pages/login/script.js',
    './pages/voter/script.js',
    './pages/voter/voter.html',
    './css/bootstrap.css',
    './css/bootstrap-grid.css',
    './css/bootstrap-reboot.css',
    './js/bootstrap.bundle.js',
    './js/bootstrap.js'
];
//TODO: add cache files
// during the install phase you usually want to cache static assets
self.addEventListener('install', function(e) {
    // once the SW is installed, go ahead and fetch the resources to make this work offline
    e.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            return cache.addAll(urlsToCache).then(function() {
                self.skipWaiting();
            });
        })
    );
});

// when the browser fetches a url
self.addEventListener('fetch', function(event) {
    // either respond with the cached object or go ahead and fetch the actual url
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) {
                // retrieve from cache
                return response;
            }
            // fetch as normal
            return fetch(event.request);
        })
    );
});