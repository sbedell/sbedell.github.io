function playAudio(audioId) {
  if (audioId) {
    document.getElementById(audioId).play();
  } else {
    console.error("Error: need to specify an audio Id to play audio");
  }
}

function playAllAudio() {
  let audioTracks = document.getElementsByTagName("audio");
  for (let track of audioTracks) {
    track.play();
  }
}

function playRandomClips() {
  let allAudioClips = document.getElementsByTagName("audio");
  let alreadyPlayed = new Set();

  while (alreadyPlayed.size < 5) {
    // Pick a random number from 0 to allAudioClips.length (11 right now)
    let rand = Math.floor(Math.random() * allAudioClips.length);
   
    if (!alreadyPlayed.has(rand)) {
      window.setTimeout(() => {
        //console.log("Playing clip: ", allAudioClips[rand]);
        allAudioClips[rand].play();
      }, 350 * alreadyPlayed.size);
      alreadyPlayed.add(rand);
    }
  }
}
