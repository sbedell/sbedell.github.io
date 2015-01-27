// HTML5 WEB STORAGE EXAMPLES:

// Session Storage:
var sessionstore = document.getElementById("sessionstore");

// See if we have an autosave value
// (this will only happen if the page is accidentally refreshed)
// Restores the contents of the text field
if (sessionStorage.getItem("autosave")) {
    sessionstore.value = sessionStorage.getItem("autosave");
}

// Listen for changes in the text field
// And save the results into the session storage object
sessionstore.addEventListener( "change", function() {
    sessionStorage.setItem("autosave", sessionstore.value);
} );

// Localstorage stuff:
var localstore = document.getElementById("localstore");
if (localStorage.getItem("testing")) {
    localstore.value = localStorage.getItem("testing");
}

document.getElementById("lsbutton").addEventListener("click", function() {
    localStorage.setItem("testing", localstore.value);
    //alert( localStorage.getItem("testing") );
} );

// Deleting local and session storage: 
document.getElementById("DELETE").addEventListener("click", function() {
    var confirmDelete = confirm("Are you sure you want to clear storage?");
    if ( confirmDelete ) {
        localStorage.clear();
        sessionStorage.clear();
    }
} );
