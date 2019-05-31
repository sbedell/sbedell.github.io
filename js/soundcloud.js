SC.initialize({client_id:'75579df892fafb681bb657af3fe524b6'});

// $(document).ready(function() {
//     SC.get('/tracks', { genres: 'dubstep' }, tracks => {
//         $(tracks).each(function(index, track) {
//             $('#results').append($('<li></li>').html(`<a target="blank" href="${track.permalink_url}">${track.title}</a>: ${track.playback_count.toLocaleString()}`));
//         });
//     });
// });

SC.get('/tracks', { genres: genre }, tracks => {
	let results = "";
	
	tracks.forEach(track => {
		results += `<li><img class="album-art" src="${track.artwork_url}"><a target="blank" href="${track.permalink_url}">${track.title}</a></li>`;
	});
	
	document.getElementById("results").innerHTML = results;
});

function setGenre() {
	var genre = document.getElementById('genre').value;
	document.getElementById('results').innerHTML = '';
	SC.get('/tracks', { genres: genre }, tracks => {
		console.log("tracks: ", tracks);
		let results = "";
		
		tracks.forEach(track => {
			results += `<li><img class="album-art" src="${track.artwork_url}"><a target="blank" href="${track.permalink_url}">${track.title}</a></li>`;
		});
		
		document.getElementById("results").innerHTML = results;
	});
}
