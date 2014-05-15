//This script combines both Google Map's map features as well as its directions service and renderer.

// Global Variables
var geocoder;
var map;
var markersArr = [];
var directionsService = new google.maps.DirectionsService();
var directionsDisplay = new google.maps.DirectionsRenderer();

/* This initializes the Google Map. It's called on page loads 
* and when the user clicks the "Reset Map" button.
*/
function initializeMap() {
	directionsDisplay.set('directions', null);
	geocoder = new google.maps.Geocoder();
	var caldwellLab = new google.maps.LatLng(40.002300, -83.015261);
	var mapOptions = {
		zoom: 8,
		center: caldwellLab,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
	
	var marker = new google.maps.Marker({
		map: map,
		position: new google.maps.LatLng(40.002300, -83.015261),
		animation: google.maps.Animation.DROP
	});
	markersArr.push(marker);
	
	google.maps.event.addListener(map, 'click', function(event) {
		addMarker(event.latLng);
	});
	directionsDisplay.setMap(map);
}

//clears all the points and directions on the map
function clearMarkers() {
	directionsDisplay.set('directions', null);
	if (markersArr) {
		for (i in markersArr) {
			markersArr[i].setMap(null);
		}
		markersArr.length = 0;
	}
}
		
/* This adds a marker with lattitude and longitute coordinates
 *  wherever the user clicks on the map
 */
function addMarker(location) {
	marker = new google.maps.Marker({
		position: location,
		map: map,
		animation: google.maps.Animation.DROP
	});
	
	var Infowindow = new google.maps.InfoWindow({
		content: location.toString(),
		position: location
	});
	markersArr.push(marker);
	Infowindow.open(map,marker);
}

/* This gets called when the user clicks the "Search" button. 
* It finds the lat and long points of the city the user types in, displays
* up to the top 10 cities found, as well as driving directions between
* the first two cities
*/
function codeAddress() {
	clearMarkers();
	var address = document.getElementById("address").value;
	geocoder.geocode( { 'address': address}, function(results, status) {
		
		if (status == google.maps.GeocoderStatus.OK && results[1] != null) {
			map.setCenter(results[0].geometry.location);
			
			for(i = 0; i<10; i++){
				if (results[i] != null){
					var Infowindow = new google.maps.InfoWindow({
						content: results[i].formatted_address,
						position: results[i].geometry.location
					});						
					var marker = new google.maps.Marker({
						map: map,
						position: results[i].geometry.location
					});
					markersArr.push(marker);
					Infowindow.open(map,marker);
				}
			}
			
			var request = {
				origin: results[0].geometry.location,
				destination: results[1].geometry.location,
				travelMode: google.maps.TravelMode.DRIVING
			};
			
			directionsService.route(request, function(response, status) {
			  if (status == google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(response);
			  }
			});					
		} else {
			alert("Two locations cannot be found with that name.");
		}				
	});
}