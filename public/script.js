const createVideo = (src) => {
  const video = `<video
      id="player-video"
      src="${src}"
      controls
      width="90%"
      height="90%"></video>`;
  document.getElementById('player-video').remove();
  document.getElementById('video-container').innerHTML=video;
};

const changePlayer = (event) => {
  const { target } = event;

  document.getElementsByClassName("active")[0].classList.remove("active");
  target.classList.add("active");
  const isStreaming = target.innerText == "Streaming";
  const player = document.getElementById("player-video");

  if (isStreaming) {
    createVideo("/stream/bunny.mp4");
  } else {
    createVideo("/movies/bunny.mp4");
  }
};