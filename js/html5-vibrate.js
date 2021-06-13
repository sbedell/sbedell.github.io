// Stops vibration
function stopVibrate() {
    navigator.vibrate(0);
}

// Vibrates once, duration determined by user.
function singleVibrate() {
    let duration = document.getElementById("viblen").value;
    // Validate user input (for numbers)
    if (duration.match(/^\d+$/)) {
        navigator.vibrate(duration);
    } else {
        document.getElementById("results").innerText = "Error, please input a number for Vibration Duration.";
    }
}

// Start persistent vibration at given duration and interval
// Assumes a number value is given
function multipleVibrate() {
    let vibArray = [];
    let duration = document.getElementById("viblen").value;
    let amountOfVibs = document.getElementById("vibinterval").value;
    let pauseLength = document.getElementById("pauselen").value;

    if ((!duration.match(/^\d+$/)) || (!amountOfVibs.match(/^\d+$/))) {
        document.getElementById("results").innerText = "Error, please input a number in both fields.";
    } else {
        for (let i = 0; i < amountOfVibs; i++) {
            vibArray.push(duration);
            vibArray.push(pauseLength);
        }
        navigator.vibrate(vibArray);
    }
}
