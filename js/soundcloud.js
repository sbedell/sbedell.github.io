SC.initialize({client_id:'75579df892fafb681bb657af3fe524b6'});

// $(document).ready(function() {
// 		console.log("document ready");
//     SC.get('/tracks', { genres: 'dubstep' }, tracks => {
//         $(tracks).each(function(index, track) {
//             $('#results').append($('<li></li>').html(`<img class="album-art" alt="album art" src="${track.artwork_url}"><a target="blank" href="${track.permalink_url}">${track.title}</a>`));
//         });
//     });
// });

// Load / Search dubstep tracks on load
document.addEventListener("DOMContentLoaded", () => {
	getAndPopulateTracks('dubstep');
});

function searchGenre() {
	let genre = document.getElementById('genre').value;

	// reset results field
	document.getElementById('results').innerHTML = '';
	
	if (genre && genre.match(/\w+/)) {
		getAndPopulateTracks(genre);
	} else {
		document.getElementById("results").innerHTML = "Please enter a genre to search.";
	}
}

function getAndPopulateTracks(genresToSearch) {
	SC.get('/tracks', { genres: genresToSearch }, tracks => {
		console.log("tracks: ", tracks);

		let results = "";
		
		tracks.forEach(track => {
			results += "<li>";
			if (track.artwork_url) {
				results += `<img class="album-art" alt="album art" src="${track.artwork_url}">`;
			}
			results += `<a target="blank" href="${track.permalink_url}">${track.title}</a></li>`;
		});
		
		document.getElementById("results").innerHTML = results;
	});
}
