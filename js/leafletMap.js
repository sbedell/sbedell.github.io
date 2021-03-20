/**
 * Leaflet and OpenStreetMap demo
 * https://leafletjs.com/reference-1.7.1.html
 */

let mymap = L.map('myMap').setView([41.49985, -81.6938], 11);

mymap.locate({setView: true, maxZoom: 16}); // Locate user with Geolocation API'

// OpenStreetMap tiles: https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
// Other map tiles to play arount with - Stamen maps:
// https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg
// https://stamen-tiles.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a>',
    maxZoom: 18
}).addTo(mymap);

// Addings some markers to the map, some with popups 
let clevelandMarker = L.marker([41.49985, -81.6938], {riseOnHover: true}).addTo(mymap);

// let testMarker = L.marker([41.219857, -81.698456]).addTo(mymap);
// testMarker.bindPopup("<b>Whipps Ledges</b><br>Cleveland Metroparks", {'autoClose': false, closeOnClick: false}).openPopup();

// let testMarker2 = L.marker([41.318818, -81.617775]).addTo(mymap);
// testMarker2.bindPopup("<b>Brecksville</b><br>Cleveland Metroparks", {'autoClose': false, closeOnClick: false}).openPopup();

let testMarker3 = L.marker([41.222891, -81.510701]).addTo(mymap);
testMarker3.bindPopup("<b>Virginia Kendall and Ritchie Ledges</b><br>Cuyahoga Valley National Park", 
    {'autoClose': false, closeOnClick: false})
    .openPopup();

mymap.on('click', onMapClick);
mymap.on('locationfound', onLocationFound);
mymap.on('locationerror', onLocationError);

function onMapClick(e) {
    L.popup().setLatLng(e.latlng).setContent(e.latlng.toString()).openOn(mymap);
}

function onLocationFound(e) {
    const circleRadius = Math.round(e.accuracy / 2);

    L.marker(e.latlng).addTo(mymap)
        .bindPopup("You are within " + circleRadius + " meters from this point", {'autoClose': false, closeOnClick: false})
        .openPopup();

    L.circle(e.latlng, {radius: circleRadius}).addTo(mymap);
}

function onLocationError(event) {
    alert(event.message);
}
