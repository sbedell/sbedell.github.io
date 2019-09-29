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
  let len = allAudioClips.length || 0;

  for (let i = 0; i < 5; i++) {
    window.setTimeout(() => {
      let rand = Math.floor(Math.random() * len);
      // console.log("Playing clip: ", allAudioClips[rand]);
      allAudioClips[rand].play();
    }, 350 * i);
  }
}
