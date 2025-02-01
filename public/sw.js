const CACHE_NAME = "pwa-cache-v1";
const OFFLINE_PAGE = "/offline.html";

const CACHE_ASSETS = [
    OFFLINE_PAGE,
    "/",  // Cache homepage if needed
];

// Install event - Caches the offline page
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Caching offline page...");
            return cache.addAll(CACHE_ASSETS);
        })
    );
    self.skipWaiting();
});

// Fetch event - Serve cached assets or offline page
self.addEventListener("fetch", (event) => {
    event.respondWith(
        fetch(event.request)
            .catch(() => caches.match(event.request).then((response) => response || caches.match(OFFLINE_PAGE)))
    );
});

// Activate event - Cleanup old caches
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log("Deleting old cache:", cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});
