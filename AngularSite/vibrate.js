// Stops vibration
function stopVibrate() {
    navigator.vibrate(0);
}

// Vibrates once, duration determined by user.
function singleVibrate() {
    var duration = document.getElementById("viblen").value;
    // Validate user input (for numbers)
    if (duration.match(/^\d+$/)) {
        navigator.vibrate(duration);
    } else {
        document.getElementById("results").innerHTML = "Error, please input a number for Vibration Duration.";
    }
}

// Start persistent vibration at given duration and interval
// Assumes a number value is given
function multipleVibrate() {
    var vibArray = [];
    var duration = document.getElementById("viblen").value;
    var amountOfVibs = document.getElementById("vibinterval").value;
    var pauseLength = document.getElementById("pauselen").value;

    if ((!duration.match(/^\d+$/)) || (!amountOfVibs.match(/^\d+$/))) {
        document.getElementById("results").innerHTML = "Error, please input a number in both fields.";
    } else {
        for (var i = 0; i < amountOfVibs; i++) {
            vibArray.push(duration);
            vibArray.push(pauseLength);			//half a second pause between vibrations
        }
        navigator.vibrate(vibArray);
    }
}
