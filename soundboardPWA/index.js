// Register service worker to control making site work offline

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/soundboardPWA/serviceWorker.js')
    .then((reg) => { 
        console.log("[index.js] Service Worker Registered.");
        console.log("Registration: ", reg); 
    })
    .catch((err) => {
        console.error("[!] Error: Registration failed - ", err);
    });
}
