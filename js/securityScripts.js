function ipSearch() {
    let ipAddress = document.getElementById("ipaddr").value;
	if (ipAddress.match(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)) {
		if (window.XMLHttpRequest) {    // code for IE7+, Firefox, Chrome, Opera, Safari
			let xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    let response = JSON.parse(xmlhttp.responseText);
                    let output = `<p>Data for IP Address: ${response.ip.number}</p>`;
                    if (response.ip.asname != null) {
                        output += `<p>Name: ${response.ip.asname}</p>`;
                    }
                    if (response.ip.country != null) {
                        output += `<p>Country: ${response.ip.country}</p>`;
                    }
                    if (response.ip.mindate != null || response.ip.maxdate != null) {
                        output += `<p>From Dates ${response.ip.mindate} to ${response.ip.maxdate}</p>`;
                    }
                    if (response.ip.attacks != null) {
                        output += `<p>Number of Attacks (against ip): ${response.ip.attacks}</p>`;
                    } else {
                        output += "<p>No recorded / detected attacks against this IP address.</p>";
                    }
                    document.getElementById("results").innerHTML = output;
                }
            }
            let url = `https://www.dshield.org/api/ip/${ipAddress}?json`;
            xmlhttp.open("GET", url, true);
            xmlhttp.send();
        } else {
            document.getElementById("results").innerHTML = "Error, this device doesn't support XML HTTP Requests.";
        }
	} else {
		document.getElementById("results").innerHTML = "Error, invalid IP (ipv4) address.";
	}
}

function portSearch() {
    let port = document.getElementById("port").value;
    // Port number validation.
    // 2^16 = 65536 aka Math.pow(2, 16);
	if (port.match(/^\d+$/) && port > 0 && port < 65536) {
        // Actually making requests here
        // Validation check for IE7+, Firefox, Chrome, Opera, Safari:
        if (window.XMLHttpRequest) {
            let xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function() {
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    let response = JSON.parse(xmlhttp.responseText);
                    let output = `<p>Data for port #: ${response.number}</p>`;
                    if ( response.services.tcp.name != 0){
                        output += `<p>Port Name / Type: ${response.services.tcp.name}</p>`;
                    }
                    if ( response.services.tcp.service != 0) {
                        output += `<p>TCP Service: ${response.services.tcp.service}</p>`;
                    }
                    output += `<p>Records: ${response.data.records}</p>`;
                    output += `<p>Targets: ${response.data.targets}</p>`;
                    output += `<p>Sources: ${response.data.sources}</p>`;
                    document.getElementById("results").innerHTML = output;
                }
            }
            let url = `https://www.dshield.org/api/port/${port}?json`;
            xmlhttp.open("GET", url, true);
            xmlhttp.send();
        } else {
            document.getElementById("results").innerHTML = "Error, this device doesn't support XML HTTP Requests.";
        }
    } else {
        document.getElementById("results").innerHTML = "Error, invalid port number.";
    }
}

function clearResults() {
	document.getElementById("results").innerHTML = "";
	document.getElementById("port").value = "";
	document.getElementById("ipaddr").value = "";
}
