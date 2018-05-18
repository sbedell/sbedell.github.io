/**
 * Implementing Caching for Progressive Web Apps
 * Taken from: https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/caches
 */ 

this.addEventListener('install', function(event) {
  event.waitUntil(caches.open('soundboardCache').then(function(cache) {
    return cache.addAll([
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
    ]);
  }));
});

this.addEventListener('fetch', function(e) {
  console.log(e.request.url);

  e.respondWith(caches.match(e.request).then(function(response) {
    return response || fetch(e.request);
  }));
});
