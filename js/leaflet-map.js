/**
 * Leaflet and OpenStreetMap demo
 * https://leafletjs.com/reference-1.7.1.html
 */

const clevelandLatLong = [41.49985, -81.6938];
let mymap = L.map('myMap').setView(clevelandLatLong, 11);

// Locate user with Geolocation API
mymap.locate({setView: true, maxZoom: 16});

// OpenStreetMap tiles: https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
// Other map tiles to play arount with - Stamen maps:
// https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg
// https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a>',
    maxZoom: 18
}).addTo(mymap);

// Addings some markers to the map, some with popups 
let clevelandMarker = L.marker(clevelandLatLong, {riseOnHover: true}).addTo(mymap);
clevelandMarker.bindPopup("Cleveland, Ohio", {'autoClose': false, closeOnClick: false});

let cvnpMarker = L.marker([41.26435, -81.56203]).addTo(mymap);
cvnpMarker.bindPopup("Cuyahoga Valley National Park", 
    {'autoClose': false, closeOnClick: false})
    .openPopup();

mymap.on('click', onMapClick);
mymap.on('locationfound', onLocationFound);
mymap.on('locationerror', onLocationError);

function onMapClick(e) {
    L.popup().setLatLng(e.latlng).setContent(e.latlng.toString()).openOn(mymap);
}

function onLocationFound(e) {
    // console.log(e);
    const circleRadius = Math.round(e.accuracy / 2);

    L.marker(e.latlng).addTo(mymap)
        .bindPopup(`You are within ${circleRadius} meters from this point`, 
        {'autoClose': false, closeOnClick: false})
        .openPopup();

    L.circle(e.latlng, {radius: circleRadius}).addTo(mymap);
}

function onLocationError(e) {
    console.error(e.message);
}
