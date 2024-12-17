const version = 'v123';  // change this everytime you update the service worker
                          // to force the browser to also update it.

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('my-cache').then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/mainscript.js',
        '/icon/icon512_maskable.png',
        '/icon/icon512_rounded.png',
        '/brandsimg/images.webp',
        '/brandsimg/Netflix.webp',
        '/brandsimg/Paramount-Logo.webp',
        '/brandsimg/Prime.webp'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      console.log(caches)

      return response || fetch(event.request);
    })
  );
});