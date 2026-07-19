"use strict";

function el(id) {
    return document.getElementById(id);
}

const IPV4_REGEX = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

function clearResults() {
    for (const id of ["lookup-status", "port-results", "ip-results", "lookup-error"]) {
        el(id).hidden = true;
    }
    el("port-results").replaceChildren();
    el("ip-results").replaceChildren();
}

function showError(message) {
    clearResults();
    el("lookup-error").textContent = message;
    el("lookup-error").hidden = false;
}

function showStatus(message) {
    el("lookup-status").textContent = message;
    el("lookup-status").hidden = false;
}

function addRow(container, label, value) {
    if (!value) {
        return;
    }
    const row = document.createElement("p");
    const labelEl = document.createElement("b");
    labelEl.textContent = `${label}: `;
    row.append(labelEl, String(value));
    container.appendChild(row);
}

async function searchIpAddress() {
    clearResults();
    const ipAddress = el("ipaddr").value.trim();

    if (!IPV4_REGEX.test(ipAddress)) {
        showError("Error: Invalid IP (ipv4) address.");
        return;
    }

    showStatus("Searching IP address…");

    try {
        const response = await fetch(`https://www.dshield.org/api/ip/${ipAddress}?json`);
        if (!response.ok) {
            throw new Error(`DShield API returned ${response.status}`);
        }
        const { ip } = await response.json();

        const container = el("ip-results");
        addRow(container, "IP Address", ip.number);
        addRow(container, "Name", ip.asname);
        addRow(container, "Country", ip.ascountry);
        if (ip.attacks) {
            const dates = ip.mindate && ip.maxdate ? ` from ${ip.mindate} to ${ip.maxdate}` : "";
            addRow(container, "Security", `${ip.attacks} attacks against this IP addr${dates}`);
        } else {
            addRow(container, "Security", "No recorded / detected attacks against this IP address.");
        }
        addRow(container, "Abuse Contact", ip.asabusecontact);

        el("lookup-status").hidden = true;
        container.hidden = false;
    } catch (error) {
        console.error(error);
        showError(`Error: ${error.message}`);
    }
}

async function searchPort() {
    clearResults();
    const port = el("port").value.trim();

    if (!/^\d+$/.test(port) || parseInt(port, 10) > 65535) {
        showError("Error: Invalid port number. Valid ports are 0-65535.");
        return;
    }

    showStatus("Searching port…");

    try {
        const response = await fetch(`https://www.dshield.org/api/port/${port}?json`);
        if (!response.ok) {
            throw new Error(`DShield API returned ${response.status}`);
        }
        const data = await response.json();

        const container = el("port-results");
        addRow(container, "Port #", data.number);
        addRow(container, "TCP Port Name / Type", data.services?.tcp?.name);
        addRow(container, "TCP Service", data.services?.tcp?.service);
        addRow(container, "UDP Port Name / Type", data.services?.udp?.name);
        addRow(container, "UDP Service", data.services?.udp?.service);

        el("lookup-status").hidden = true;
        container.hidden = false;
    } catch (error) {
        console.error(error);
        showError(`Error: ${error.message}`);
    }
}

function initBrowserInfo() {
    el("user-agent").textContent = navigator.userAgent;
    el("monitor-res").textContent = `${window.screen.width} x ${window.screen.height}`;

    function updateBrowserSize() {
        el("browser-res").textContent = `${window.innerWidth} x ${window.innerHeight}`;
    }
    window.addEventListener("resize", updateBrowserSize);
    updateBrowserSize();
}

el("search-ip-btn").addEventListener("click", searchIpAddress);
el("search-port-btn").addEventListener("click", searchPort);
el("clear-results-btn").addEventListener("click", clearResults);
el("copyright-dates").textContent = `2013 - ${new Date().getFullYear()}`;
initBrowserInfo();
