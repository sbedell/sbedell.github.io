var sessionStore = document.getElementById("sessionstore");
var bgColorSelector = document.getElementById("bgcolor");

// Loading values if present:
if (sessionStorage.getItem("autosave")) {
    sessionStore.value = sessionStorage.getItem("autosave");
}

if (localStorage.getItem("bgColor")) {
    bgColorSelector.value = localStorage.getItem("bgColor");
    changeBackgroundColor(bgColorSelector.value);
}

function changeBackgroundColor(color) {
    if (typeof color === "string") {
        document.body.style.backgroundColor = color;
    }
}

// ~~~~~ Adding Event Listeners ~~~~~
sessionStore.addEventListener("change", () => {
    sessionStorage.setItem("autosave", sessionStore.value);
});

bgColorSelector.addEventListener("change", () => {
    var newBG = document.getElementById("bgcolor").value;
    localStorage.setItem("bgColor", newBG);
    changeBackgroundColor(newBG);
});

document.getElementById("DELETE").addEventListener("click", () => {
    if (confirm("Are you sure you want to clear storage?")) {
        localStorage.clear();
        sessionStorage.clear();
    }
});
