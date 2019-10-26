let sessionStore = document.getElementById("sessionstore");
let bgColorSelector = document.getElementById("bgcolor");

function changeBackgroundColor(color) {
    if (typeof color === "string") {
        document.body.style.backgroundColor = color;
    }
}

// ~~~~~ Loading values if present ~~~~~
if (window.sessionStorage.getItem("autosave")) {
    sessionStore.value = window.sessionStorage.getItem("autosave");
}

if (window.localStorage.getItem("bgColor")) {
    bgColorSelector.value = window.localStorage.getItem("bgColor");
    changeBackgroundColor(bgColorSelector.value);
}

// ~~~~~ Adding Event Listeners ~~~~~
sessionStore.addEventListener("change", function() {
    // console.log("onChange event fired, autosaving Session Storage");
    window.sessionStorage.setItem("autosave", sessionStore.value);
});

bgColorSelector.addEventListener("change", function() {
    let newBgColor = document.getElementById("bgcolor").value;
    window.localStorage.setItem("bgColor", newBgColor);
    changeBackgroundColor(newBgColor);
});

document.getElementById("deleteButton").addEventListener("click", function() {
    if (window.confirm("Are you sure you want to clear storage?")) {
        window.localStorage.clear();
        window.sessionStorage.clear();
    }
});
