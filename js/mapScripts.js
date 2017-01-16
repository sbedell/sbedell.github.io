// Global Variables
var geocoder;
var map;
var markersArr = [];

/**
 *  This initializes the Google Map. It's called on page loads
 * and when the user clicks the "Reset Map" button.
 */
function initializeMap() {
	// reset the input box:
	document.getElementById("address").value = "";

	geocoder = new google.maps.Geocoder();
	var clevelandOhio = new google.maps.LatLng(41.49985, -81.6938);
	var mapOptions = {
		zoom: 8,
		center: clevelandOhio,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

	var marker = new google.maps.Marker({
		map: map,
		position: clevelandOhio,
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
		markersArr.forEach(function(marker) {
			marker.setMap(null);
		});
		// reset the array:
		markersArr.length = 0;
	}
}

/**
 * This adds a marker with lattitude and longitute coordinates
 *  wherever the user clicks on the map
 */
function addMarker(location) {
	var marker = new google.maps.Marker({
		position: location,
		map: map,
		animation: google.maps.Animation.DROP
	});

	var infoWindow = new google.maps.InfoWindow({
		content: location.lat().toFixed(4) + ", " + location.lng().toFixed(4),
		position: location
	});
	markersArr.push(marker);
	infoWindow.open(map, marker);
}

/*
* This gets called when the user clicks the "Search" button.
* It finds the lat and long points of the city the user types in and displays
* up to the top 10 cities found,
*/
function codeAddress() {
	clearMarkers();
	var address = document.getElementById("address").value;

	geocoder.geocode({'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK && results) {
			if (results[0]) {
				map.setCenter(results[0].geometry.location);
			}

			results.forEach(function(result) {
				if (result) {
					var infoWindow = new google.maps.InfoWindow({
						content: result.formatted_address,
						position: result.geometry.location
					});
					var marker = new google.maps.Marker({
						map: map,
						position: result.geometry.location
					});
					markersArr.push(marker);
					infoWindow.open(map, marker);
				}
			});
		} else {
			alert("No locations found.");
		}
	});
}
