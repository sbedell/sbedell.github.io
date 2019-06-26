function playAudio(audioId) {
  if (audioId) {
    document.getElementById(audioId).play();
  } else {
    console.error("Error: need to specify an audio Id to play audio");
  }
}
