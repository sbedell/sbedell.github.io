// Register service worker to control making site work offline

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/soundboardPWA/serviceWorker.js').then(function() { 
        console.log('[index.js] Service Worker Registered'); 
    });
}
