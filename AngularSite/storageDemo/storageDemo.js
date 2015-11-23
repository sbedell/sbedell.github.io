var sessionstore = document.getElementById("sessionstore");
var bgColorSelector = document.getElementById("bgcolor");

function changeBackgroundColor(color) {
    if (typeof color === "string") {
        document.styleSheets[0].cssRules[4].style.backgroundColor = color;
    } else {
        alert("Error");
    }
}

function deleteStorage() {
    var confirmDelete = confirm("Are you sure you want to clear storage?");
    if (confirmDelete) {
        localStorage.clear();
        sessionStorage.clear();
    }
}

// Loading values if present:
if (sessionStorage.getItem("autosave")) {
    sessionstore.value = sessionStorage.getItem("autosave");
}

if (localStorage.getItem("bgColor")) {
    bgColorSelector.value = localStorage.getItem("bgColor");
    changeBackgroundColor(bgColorSelector.value);
}

// ~~~~~ Adding Event Listeners ~~~~~

sessionstore.addEventListener("change", function() {
    sessionStorage.setItem("autosave", sessionstore.value);
});

bgColorSelector.addEventListener("change", function() {
    var newBG = document.getElementById("bgcolor").value;
    localStorage.setItem("bgColor", newBG);
    changeBackgroundColor(newBG);
    window.location.reload(true);
} );

document.getElementById("DELETE").addEventListener("click", deleteStorage);
