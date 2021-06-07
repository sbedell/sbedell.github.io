window.addEventListener('load', () => {
    // console.log("window load event fired");
    toastr.options = {
        "progressBar": true,
        "positionClass": "toast-top-center",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };
});

let browserSection = new Vue({
    el: "#browser-section",
    data: {
        userAgent: navigator.userAgent,
        monitorResolution: `${window.screen.availWidth} x ${window.screen.availHeight}`,
        browserResolution: `${window.innerWidth} x ${window.innerHeight}`
    }
});

let copySection = new Vue({
    el: "#copyright-section",
    data: {
        copyrightDates: `2013 - ${new Date().getFullYear()}`
    }
});

let searchSection = new Vue({
    el: '#search-section-vue',
    data: {
        apiResponsePort: null,
        apiResponseIpAddr: null,
        errorText: ""
    },
    methods: {
        searchIpAddressVue: function() {
            this.clearResults();
            let ipAddress = document.getElementById("ipaddr").value.trim();

            if (ipAddress.match(/^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/)) {
                toastr.info("Searching IP Address...");

                fetch(`https://www.dshield.org/api/ip/${ipAddress}?json`)
                    .then(res => res.json())
                    .then(response => {
                        this.apiResponseIpAddr = response;
                    }).catch(error => {
                        console.error('Error:', error);
                        this.errorText = error;
                    }).finally(() => {
                        toastr.clear();
                    });
            } else {
                this.errorText = "Error: Invalid IP (ipv4) address.";
            }
        },
        searchPortVue: function() {
            this.clearResults();
            let port = document.getElementById("port").value.trim();
            
            if (port.match(/^\d+$/) && parseInt(port) > 0 && parseInt(port) < 65536) {
                toastr.info("Searching Port...");

                fetch(`https://www.dshield.org/api/port/${port}?json`)
                    .then(res => res.json())
                    .then(response => {
                        this.apiResponsePort = response;
                    }).catch(error => {
                        console.error('Error:', error);
                        this.errorText = error;
                    }).finally(() => {
                        toastr.clear();
                    });
            } else {
                this.errorText = "Error: Invalid port number. Valid ports are 0-65536.";
            }
        },
        clearResults: function() {
            this.apiResponsePort = null;
            this.apiResponseIpAddr = null;
            this.errorText = "";
        }
    }
});
