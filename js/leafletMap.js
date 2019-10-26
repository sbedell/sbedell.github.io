/**
 * Leaflet and OpenStreetMap demo
 */

let mymap = L.map('myMap').setView([41.49985, -81.6938], 11);

mymap.locate({setView: true, maxZoom: 16}); // Locate user with Geolocation API

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a>',
    maxZoom: 18
}).addTo(mymap);

// Addings some markers to the map, some with popups 
let clevelandMarker = L.marker([41.49985, -81.6938]).addTo(mymap);

let testMarker = L.marker([41.219857, -81.698456]).addTo(mymap);
testMarker.bindPopup("<b>Whipps Ledges</b><br>Cleveland Metroparks", {'autoClose': false, closeOnClick: false}).openPopup();

let testMarker2 = L.marker([41.318818, -81.617775]).addTo(mymap);
testMarker2.bindPopup("<b>Brecksville</b><br>Cleveland Metroparks", {'autoClose': false, closeOnClick: false}).openPopup();

let testMarker3 = L.marker([41.222891, -81.510701]).addTo(mymap);
testMarker3.bindPopup("<b>Virginia Kendall and Ritchie Ledges</b><br>Cuyahoga Valley National Park", {'autoClose': false, closeOnClick: false}).openPopup();

// Adding Event Listeners:
mymap.on('click', onMapClick);
mymap.on('locationfound', onLocationFound);
mymap.on('locationerror', onLocationError);

// Listener Functions:
function onMapClick(e) {
    let popup = L.popup();
    popup.setLatLng(e.latlng).setContent(e.latlng.toString()).openOn(mymap);
}

function onLocationFound(e) {
    // console.log(e);
    let radius = Math.round(e.accuracy / 2);

    L.marker(e.latlng).addTo(mymap)
        .bindPopup("You are within " + radius + " meters from this point", {'autoClose': false, closeOnClick: false})
        .openPopup();

    L.circle(e.latlng, radius).addTo(mymap);
}

function onLocationError(event) {
    alert(event.message);
}
