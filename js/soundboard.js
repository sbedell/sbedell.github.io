function playAudio(audioId) {
  if (audioId) {
    document.getElementById(audioId).play();
  } else {
    console.error("Error: need to specify an audio Id to play audio");
  }
}

function playAllAudio() {
  let audioTracks = document.getElementsByTagName("audio");
  for (track of audioTracks) {
    document.getElementById(track.id).play();
  }
}