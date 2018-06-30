/**
 * Implementing Caching for Progressive Web Apps
 * Taken from: https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/caches
 */ 

var cacheName = 'soundboardPwaCache-v1';
var appFiles = [
  '/soundboardPWA/',
  '/soundboardPWA/index.html',
  '/soundboardPWA/index.js',
  '/soundboardPWA/styles.css',
  '/soundboardPWA/icons/music-note64.png',
  '/soundboardPWA/icons/music-note256.png'
];

// Not using this yet:
var audioFiles = [
  '/soundboardPWA/audio/ahahah.mp3',
  '/soundboardPWA/audio/AIRHORN.mp3',
  '/soundboardPWA/audio/damnSon.mp3',
  '/soundboardPWA/audio/handsofengineers.mp3',
  '/soundboardPWA/audio/holdontoyourbutts.mp3',
  '/soundboardPWA/audio/multiAirhorn.mp3',
  '/soundboardPWA/audio/nicememe.mp3',
  '/soundboardPWA/audio/shotsFired.mp3',
  '/soundboardPWA/audio/SMOKEWEEDEVERYDAY.mp3',
  '/soundboardPWA/audio/SometimesThingsGetComplicated.mp3'
];

self.addEventListener('install', function(event) {
  console.log("[ServiceWorker] Installed");
  
  event.waitUntil(caches.open(cacheName).then(function(cache) {
    console.log("[ServiceWorker] Caching app shell");
    return cache.addAll(appFiles);
  }));
});

// Network first (and cache response), cache fallback
self.addEventListener('fetch', function(event) {
  console.log('[Service Worker] Fetching resource ' + event.request.url);

  event.respondWith(caches.open(cacheName).then(function(cache) {
    return fetch(event.request).then(function(response) {
      console.log('[Service Worker] Fetching from network');
      cache.put(event.request.url, response.clone());
      return response;
    }).catch(function() {
      // return cached content if network fails
      console.log('[Service Worker] Fetching from cache');
      return cache.match(event.request);
    });
  }));
});

// Supposed to delete old cache objects
self.addEventListener('activate', function(event) {
  console.log('[ServiceWorker] Activate');

  event.waitUntil(caches.keys().then(function(keyList) {
    return Promise.all(keyList.map(function(key) {
      if (cacheName.indexOf(key) === -1) {
        console.log('[ServiceWorker] Removing old cache', key);
        return caches.delete(key);
      }
    }));
  }));
});
