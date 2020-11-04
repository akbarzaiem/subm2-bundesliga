const CACHE_NAME = 'bundesliga-v1';
var urlsToCache = [
    "/",
    "/nav.html",
    "/index.html",
    "/pages/home.html",
    "/pages/saved.html",
    "/pages/tim.html",
    "/css/materialize.min.css",
    "/js/materialize.min.js",
    "/js/materialize.js",
    "/js/nav.js",
    "/js/api.js",
    "/js/idb.js",
    "/image/bundes-logo.png",
    "/image/football-badge.png",
    "/image/star.png",
    "/image/trophy.png",
    "/icon1.png",
    "/icon2.png",
    "/manifest.json"
];


//Menyimpan aset ke cache
self.addEventListener("install", function (event) {
    event.waitUntil(
        caches.open(CACHE_NAME).then(function (cache) {
            return cache.addAll(urlsToCache);
        })
    );
});


// menghapus cache lama, ketika update vesion terbaru, agar pengguna tidak terbebani akan sizenya
self.addEventListener("fetch", function (event) {
    var base_url = "https://api.football-data.org/v2/";
    if (event.request.url.indexOf(base_url) > -1) {
        event.respondWith(
            caches.open(CACHE_NAME).then(function (cache) {
                return fetch(event.request).then(function (response) {
                    cache.put(event.request.url, response.clone());
                    return response;
                })
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request, { ignoreSearch: true }).then(function (response) {
                return response || fetch(event.request);
            })
        )
    }
});

// hapus cache ketika update version 
self.addEventListener("activate", function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheName != CACHE_NAME) {
                        console.log("ServiceWorker: cache " + cacheName + " dihapus");
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// push notification
self.addEventListener('push', function (event) {
    var body;
    if (event.data) {
        body = event.data.text();
    } else {
        body = 'Push message no payload';
    }
    var options = {
        body: body,
        icon: 'icon.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };
    event.waitUntil(
        self.registration.showNotification('Push Notification', options)
    );
});