angular.module('securityPage').controller('SecurityController', function() {
    function ipSearch() {
        var ipAddress = document.getElementById("ipaddr").value;
    	if (ipAddress.match(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)) {
			var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    var responseText = JSON.parse(xmlhttp.responseText);
                    var output = "<p>Data for IP Address: " + responseText.ip.number + "</p>";
                    if (responseText.ip.asname != null) {
                        output += "<p>Name: " + responseText.ip.asname + "</p>";
                    }
                    if (responseText.ip.country != null) {
                        output += "<p>Country: " + responseText.ip.country + "</p>";
                    }
                    if (responseText.ip.mindate != null || responseText.ip.maxdate != null) {
                        output += "<p>From Dates " + responseText.ip.mindate + " to " + responseText.ip.maxdate + "</p>";
                    }
                    if (responseText.ip.attacks != null) {
                        output += "<p>Number of Attacks (against ip): " + responseText.ip.attacks + "</p>";
                    } else {
                        output += "<p>No recorded / detected attacks against this IP address.</p>";
                    }
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
        var port = document.getElementById("port").value;
        // Port number validation.
        // 2^16 = 65536 aka Math.pow(2, 16);
    	if (port.match(/^\d+$/) && port > 0 && port < 65536) {
            // Actually making requests here

            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    var responseText = JSON.parse(xmlhttp.responseText);
                    var output = "<p>Data for port # : " + responseText.number + "</p>";
                    if ( responseText.services.tcp.name != 0){
                        output += "<p>Port Name / Type: " + responseText.services.tcp.name + "</p>";
                    }
                    if ( responseText.services.tcp.service != 0) {
                        output += "<p>TCP Service: " + responseText.services.tcp.service + "</p>";
                    }
                    output += "<p>Records: " + responseText.data.records + "</p>";
                    output += "<p>Targets: " + responseText.data.targets + "</p>";
                    output += "<p>Sources: " + responseText.data.sources + "</p>";
                    document.getElementById("results").innerHTML = output;
                }
            }
            var url = "https://www.dshield.org/api/port/" + port + "?json";
            xmlhttp.open("GET", url, true);
            xmlhttp.send();
        } else {
            document.getElementById("results").innerHTML = "Error, invalid port number.";
        }
    }

    function clearResults() {
    	document.getElementById("results").innerHTML = "";
    	document.getElementById("port").value = "";
    	document.getElementById("ipaddr").value = "";
    }
});
