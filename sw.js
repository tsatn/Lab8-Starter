// sw.js - This file needs to be in the root of the directory to work,
//         so do not move it next to the other scripts
const CACHE_NAME = 'lab-8-starter';

const urlsToCache = [
  // List of URLs to cache initially
  './index.html',
  './styles/main.css',
  './scripts/main.js',
  './images/logo.png'
];
// Install event - Caches important files and recipe data
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
        console.log('Opened cache');
        // B6. TODO - Add all of the URLs from RECIPE_URLs here so that they are
        //            added to the cache when the ServiceWorker is installed
        return cache.addAll(urlsToCache);
    })
  );
});


// Activates the service worker
self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

// Intercept fetch requests and cache them
self.addEventListener('fetch', function (event) {
  // We added some known URLs to the cache above, but tracking down every
  // subsequent network request URL and adding it manually would be very taxing.
  // We will be adding all of the resources not specified in the intiial cache
  // list to the cache as they come in.
  /*******************************/
  // This article from Google will help with this portion. Before asking ANY
  // questions about this section, read this article.
  // NOTE: In the article's code REPLACE fetch(event.request.url) with
  //       fetch(event.request)
  // https://developer.chrome.com/docs/workbox/caching-strategies-overview/
  /*******************************/
  // B7. TODO - Respond to the event by opening the cache using the name we gave
  //            above (CACHE_NAME)
  // B8. TODO - If the request is in the cache, return with the cached version.
  //            Otherwise fetch the resource, add it to the cache, and return
  //            network response.
  event.respondWith(
    caches.match(event.request)
      .then(response => {

        // Cache hit - return the cached response
        if (response) {
          return response;
        }

        return fetch(event.request).then(newResponse => {
          if (!newResponse || newResponse.status !== 200 || newResponse.type !== 'basic') {
            return newResponse;
          }

          var responseToCache = newResponse.clone();

          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });

          return newResponse;
        });
      })
  );
});