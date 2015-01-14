//This script combines both Google Map's map features as well as its directions service and renderer.

// Global Variables
var geocoder;
var map;
var markersArr = [];

/* This initializes the Google Map. It's called on page loads 
* and when the user clicks the "Reset Map" button.
*/
function initializeMap() {
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
		position: caldwellLab,
		animation: google.maps.Animation.DROP
	});
	markersArr.push(marker);
	
	google.maps.event.addListener(map, 'click', function(event) {
		addMarker(event.latLng);
	});
}

// Clears all the points and directions on the map
function clearMarkers() {
	if (markersArr) {
		for (var i in markersArr) {
			markersArr[i].setMap(null);
		}
		markersArr.length = 0; 		// resets the entire array
		document.getElementById("address").value = "";  	// resets the form field.
	}
}
		
/* 
 * This adds a marker with lattitude and longitute coordinates
 *  wherever the user clicks on the map
 */
function addMarker(location) {
	marker = new google.maps.Marker({
		position: location,
		map: map,
		animation: google.maps.Animation.DROP
	});
	
	var Infowindow = new google.maps.InfoWindow( {
		content: location.toString().trim(),
		position: location
	} );
	markersArr.push(marker);
	Infowindow.open(map, marker);
}

/* 
* This gets called when the user clicks the "Search" button. 
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
			
			for(var i = 0; i < 10; i++) {
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
					Infowindow.open(map, marker);
				}
			}
		} else if (status == google.maps.GeocoderStatus.OK && results[0] != null) {
			alert("Two locations cannot be found with that name.");
			map.setCenter(results[0].geometry.location);
			var Infowindow = new google.maps.InfoWindow({
				content: results[0].formatted_address,
				position: results[0].geometry.location
			});
			var marker = new google.maps.Marker({
				map: map,
				position: results[0].geometry.location
			});
			markersArr.push(marker);
			Infowindow.open(map, marker);
		} else {
			alert("No locations found.");
		}
	});
}