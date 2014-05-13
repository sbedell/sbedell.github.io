function ipSearch() {
	if (document.getElementById("ipaddr").value.match(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)) {
		var ipAddress = document.getElementById("ipaddr").value;
		var xmlhttp;
		if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
			xmlhttp = new XMLHttpRequest();
		}	
		xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				var responseText = JSON.parse(xmlhttp.responseText);
				var output = "<p>Data for IP Address: " + responseText.ip.number + "</p>";
				output = output + "<p>Name: " + responseText.ip.asname + "</p>";
				output = output + "<p>Country: " + responseText.ip.country+ "</p>";
				output = output + "<p>From Dates " + responseText.ip.mindate + " to " + responseText.ip.maxdate + "</p>";
				output = output + "<p>Number of Attacks (against ip): " + responseText.ip.attacks + "</p>";
				document.getElementById("results").innerHTML = output;
			}
		}
		var url = "https://www.dshield.org/api/ip/" + ipAddress + "?json";
		xmlhttp.open("GET", url, true);
		xmlhttp.send();
	} else {
		document.getElementById("results").innerHTML = "Error, invalid IP (ipv4) address.";
	}
}

function portSearch() {
	if (document.getElementById("port").value.match(/^\d+$/)) {
		var port = document.getElementById("port").value;
		if (port > 0 && port < 70000) {
			var xmlhttp;
			//Actually making requests here
			if (window.XMLHttpRequest) {// code for IE7+, Firefox, Chrome, Opera, Safari
				xmlhttp = new XMLHttpRequest();
			}	
			xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
					var responseText = JSON.parse(xmlhttp.responseText);
					var output = "<p>" + responseText.services.tcp.name + "</p>";
					output = output + "<p>Port: " + responseText.number + "</p>";
					output = output + "<p>TCP Service: " + responseText.services.tcp.service + "</p>";
					output = output + "<p>Records: " + responseText.data.records + "</p>";
					output = output + "<p>Targets: " + responseText.data.targets + "</p>";
					output = output + "<p>Sources: " + responseText.data.sources + "</p>";
					//alert(responseText.services.udp.service);
					document.getElementById("results").innerHTML = output;
				}
			}
			var url = "https://www.dshield.org/api/port/" + port + "?json";
			xmlhttp.open("GET", url, true);
			xmlhttp.send();
		} else {
			document.getElementById("results").innerHTML = "Error, invalid port number.";
		}
	} else {
		document.getElementById("results").innerHTML = "Error, please input a number.";
	}
}

function clearResults() {
	document.getElementById("results").innerHTML = "";
	document.getElementById("port").value = "";
	document.getElementById("ipaddr").value = "";
}