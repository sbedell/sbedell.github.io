SC.initialize({client_id:'75579df892fafb681bb657af3fe524b6'});

// Load / Search dubstep tracks on load
document.addEventListener("DOMContentLoaded", () => {
	getAndPopulateTracks("dubstep");
});

document.getElementById("search-btn").addEventListener("click", searchGenre);

function searchGenre() {
	let genre = document.getElementById("genre-input").value;

	if (genre && genre.match(/\w+/)) {
		getAndPopulateTracks(genre);
	} else {
		console.warn("Please enter a genre to search.");
	}
}

function getAndPopulateTracks(genresToSearch) {
	SC.get('/tracks', { genres: genresToSearch }, tracks => {
		// console.log("tracks: ", tracks);

		if (tracks) {
			let results = "";

			tracks.forEach(track => {
				results += "<li>";
				if (track.artwork_url) {
					results += `<img class="album-art" alt="album art" src="${track.artwork_url}">`;
				}
				results += `<a target="blank" href="${track.permalink_url}">${track.title}</a></li>`;
			});

			document.getElementById("results").innerHTML = results;
		} else {
			document.getElementById("results").innerText = "No tracks found.";
		}
	});
}
