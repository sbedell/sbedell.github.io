/**
 * Implementing Caching for Progressive Web Apps
 * 
 * https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Offline_Service_workers
 * https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
 * https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/caches
 */ 

let cacheName = 'soundboardPwaCache-v1.3';
let appFiles = [
  '/soundboardPWA/',
  '/soundboardPWA/index.html',
  '/soundboardPWA/index.js',
  '/soundboardPWA/soundboard.js',
  '/soundboardPWA/styles.css',
  '/soundboardPWA/icons/music-note64.png',
  '/soundboardPWA/icons/music-note256.png'
];

let audioFiles = [
  '/soundboardPWA/audio/ahahah.mp3',
  '/soundboardPWA/audio/AIRHORN.mp3',
  '/soundboardPWA/audio/damnSon.mp3',
  '/soundboardPWA/audio/handsofengineers.mp3',
  '/soundboardPWA/audio/holdontoyourbutts.mp3',
  '/soundboardPWA/audio/multiAirhorn.mp3',
  '/soundboardPWA/audio/nicememe.mp3',
  '/soundboardPWA/audio/PocketFullOfDubs.mp3',
  '/soundboardPWA/audio/SMOKEWEEDEVERYDAY.mp3',
  '/soundboardPWA/audio/Steam-Machine.mp3'
];

self.addEventListener('install', (event) => {
  console.log("[ServiceWorker] Installed");
  
  event.waitUntil(caches.open(cacheName).then((cache) => {
    console.log("[ServiceWorker] Caching app shell & audio content.");
    return cache.addAll(appFiles.concat(audioFiles));
  }));
});

// Network first (and cache response), cache fallback
self.addEventListener('fetch', (event) => {
  // console.log("event: ", event);
  // console.log('[Service Worker] Fetching resource: ', event.request.url);

  event.respondWith(caches.open(cacheName).then((cache) => {
    return fetch(event.request).then((response) => {
      console.log('[Service Worker] Fetching from network: ', event.request.url);
      cache.put(event.request, response.clone());
      return response;
    }).catch(() => {
      // return cached content if network fails
      console.log('[Service Worker] Fetching from cache: ', event.request.url);
      return cache.match(event.request);
    });
  }));
});

// Supposed to delete old cache objects
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');

  event.waitUntil(caches.keys().then((keyList) => {
    return Promise.all(keyList.map((key) => {
      if (cacheName.indexOf(key) === -1) {
        console.log('[ServiceWorker] Removing old cache: ', key);
        return caches.delete(key);
      }
    }));
  }));
});
