/**
 * Implementing Caching for Progressive Web Apps
 * Taken from: https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/caches
 */ 

var cacheName = 'soundboardCache-v2';
var appFiles = [
  '/soundboard/',
  '/soundboard/index.html',
  '/soundboard/index.js',
  '/soundboard/styles.css',
  '/soundboard/icons/music-player.png',
  '/soundboard/audio/ahahah.mp3',
  '/soundboard/audio/AIRHORN.mp3',
  '/soundboard/audio/damnSon.mp3',
  '/soundboard/audio/handsofengineers.mp3',
  '/soundboard/audio/holdontoyourbutts.mp3',
  '/soundboard/audio/multiAirhorn.mp3',
  '/soundboard/audio/nicememe.mp3',
  '/soundboard/audio/shotsFired.mp3',
  '/soundboard/audio/SMOKEWEEDEVERYDAY.mp3',
  '/soundboard/audio/SometimesThingsGetComplicated.mp3'
];

this.addEventListener('install', function(event) {
  console.log("[Service worker] installed...btw where are these logged at?");
  
  event.waitUntil(caches.open(cacheName).then(function(cache) {
    console.log("[Service Worker] Caching app shell and content");
    return cache.addAll(appFiles);
  }));
});

this.addEventListener('fetch', function(event) {
  console.log('[Service Worker] Fetched resource ' + event.request.url);

  event.respondWith(caches.match(event.request).then(function(response) {
    return response || fetch(event.request).then(function(response) {
      return caches.open(cacheName).then(function(cache) {
        console.log('[Service Worker] Caching new resource: ' + event.request.url);
        cache.put(event.request, response.clone());
        return response;
      });
    });
  }));
});

// supposedly deletes old cache objects?
this.addEventListener('activate', function(event) {
  event.waitUntil(caches.keys().then(function(keyList) {
    return Promise.all(keyList.map(function(key) {
      if (cacheName.indexOf(key) === -1) {
        return caches.delete(key);
      }
    }));
  }));
});
