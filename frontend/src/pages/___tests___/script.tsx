const playPauseBtn: Element | null = document.querySelector(".play-pause-btn");
const theaterBtn: Element | null = document.querySelector(".theater-btn");
const fullScreenBtn: Element | null =
  document.querySelector(".full-screen-btn");
const miniPlayerBtn: Element | null =
  document.querySelector(".mini-player-btn");
const muteBtn: Element | null = document.querySelector(".mute-btn");
const captionsBtn: Element | null = document.querySelector(".captions-btn");
const speedBtn: Element | null = document.querySelector(".speed-btn");
const currentTimeElem: Element | null = document.querySelector(".current-time");
const totalTimeElem: Element | null = document.querySelector(".total-time");
const previewImg: Element | null = document.querySelector(".preview-img");
const thumbnailImg: Element | null = document.querySelector(".thumbnail-img");
const volumeSlider: Element | null = document.querySelector(".volume-slider");
const videoContainer: Element | null =
  document.querySelector(".video-container");
const timelineContainer: Element | null = document.querySelector(
  ".timeline-container"
);
const video: HTMLVideoElement | null = document.querySelector("video");

document.addEventListener("keydown", (e: KeyboardEvent) => {
  const tagName: string = document.activeElement?.tagName.toLowerCase();

  if (tagName === "input") return;

  switch (e.key.toLowerCase()) {
    case " ":
      if (tagName === "button") return;
    case "k":
      togglePlay();
      break;
    case "f":
      toggleFullScreenMode();
      break;
    case "t":
      toggleTheaterMode();
      break;
    case "i":
      toggleMiniPlayerMode();
      break;
    case "m":
      toggleMute();
      break;
    case "arrowleft":
    case "j":
      skip(-5);
      break;
    case "arrowright":
    case "l":
      skip(5);
      break;
    case "c":
      toggleCaptions();
      break;
  }
});

// Timeline
timelineContainer.addEventListener("mousemove", handleTimelineUpdate);
timelineContainer.addEventListener("mousedown", toggleScrubbing);
document.addEventListener("mouseup", (e) => {
  if (isScrubbing) toggleScrubbing(e);
});
document.addEventListener("mousemove", (e) => {
  if (isScrubbing) handleTimelineUpdate(e);
});

let isScrubbing = false;
let wasPaused: boolean;
function toggleScrubbing(e: MouseEvent) {
  const rect = timelineContainer.getBoundingClientRect();
  const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
  isScrubbing = (e.buttons & 1) === 1;
  videoContainer.classList.toggle("scrubbing", isScrubbing);
  if (isScrubbing) {
    wasPaused = video.paused;
    video.pause();
  } else {
    video.currentTime = percent * video.duration;
    if (!wasPaused) video.play();
  }

  handleTimelineUpdate(e);
}

function handleTimelineUpdate(e: MouseEvent) {
  const rect = timelineContainer.getBoundingClientRect();
  const percent = Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
  const previewImgNumber = Math.max(
    1,
    Math.floor((percent * video.duration) / 10)
  );
  const previewImgSrc = `assets/previewImgs/preview${previewImgNumber}.jpg`;
  previewImg.src = previewImgSrc;
  timelineContainer.style.setProperty("--preview-position", percent.toString());

  if (isScrubbing) {
    e.preventDefault();
    thumbnailImg.src = previewImgSrc;
    timelineContainer.style.setProperty(
      "--progress-position",
      percent.toString()
    );
  }
}

// Playback Speed
speedBtn.addEventListener("click", changePlaybackSpeed);

function changePlaybackSpeed() {
  let newPlaybackRate = video.playbackRate + 0.25;
  if (newPlaybackRate > 2) newPlaybackRate = 0.25;
  video.playbackRate = newPlaybackRate;
  speedBtn.textContent = `${newPlaybackRate}x`;
}

// Captions
const captions = video.textTracks[0];
captions.mode = "hidden";

captionsBtn.addEventListener("click", toggleCaptions);

function toggleCaptions() {
  const isHidden = captions.mode === "hidden";
  captions.mode = isHidden ? "showing" : "hidden";
  videoContainer.classList.toggle("captions", isHidden);
}

// Duration
video.addEventListener("loadeddata", () => {
  totalTimeElem.textContent = formatDuration(video.duration);
});

video.addEventListener("timeupdate", () => {
  currentTimeElem.textContent = formatDuration(video.currentTime);
  const percent = video.currentTime / video.duration;
  timelineContainer.style.setProperty(
    "--progress-position",
    percent.toString()
  );
});

const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
  minimumIntegerDigits: 2,
});
function formatDuration(time: number) {
  const seconds = Math.floor(time % 60);
  const minutes = Math.floor(time / 60) % 60;
  const hours = Math.floor(time / 3600);
  if (hours === 0) {
    return `${minutes}:${leadingZeroFormatter.format(seconds)}`;
  } else {
    return `${hours}:${leadingZeroFormatter.format(
      minutes
    )}:${leadingZeroFormatter.format(seconds)}`;
  }
}

function skip(duration: number) {
  video.currentTime += duration;
}

// Volume
muteBtn.addEventListener("click", toggleMute);
volumeSlider.addEventListener("input", (e) => {
  video.volume = Number(e.target.value);
  video.muted = e.target.value === "0";
});

function toggleMute() {
  video.muted = !video.muted;
}

video.addEventListener("volumechange", () => {
  volumeSlider.value = video.volume.toString();
  let volumeLevel;
  if (video.muted || video.volume === 0) {
    volumeSlider.value = "0";
    volumeLevel = "muted";
  } else if (video.volume >= 0.5) {
    volumeLevel = "high";
  } else {
    volumeLevel = "low";
  }

  videoContainer.dataset.volumeLevel = volumeLevel;
});

// View Modes
theaterBtn.addEventListener("click", toggleTheaterMode);
fullScreenBtn.addEventListener("click", toggleFullScreenMode);
miniPlayerBtn.addEventListener("click", toggleMiniPlayerMode);

function toggleTheaterMode() {
  videoContainer.classList.toggle("theater");
}

function toggleFullScreenMode() {
  if (document.fullscreenElement == null) {
    videoContainer.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
}

function toggleMiniPlayerMode() {
  if (videoContainer.classList.contains("mini-player")) {
    document.exitPictureInPicture();
  } else {
    video.requestPictureInPicture();
  }
}

document.addEventListener("fullscreenchange", () => {
  videoContainer.classList.toggle(
    "full-screen",
    document.fullscreenElement !== null
  );
});

video.addEventListener("enterpictureinpicture", () => {
  videoContainer.classList.add("mini-player");
});

video.addEventListener("leavepictureinpicture", () => {
  videoContainer.classList.remove("mini-player");
});

// Play/Pause
playPauseBtn.addEventListener("click", togglePlay);
video.addEventListener("click", togglePlay);

function togglePlay() {
  video.paused ? video.play() : video.pause();
}

video.addEventListener("play", () => {
  videoContainer.classList.remove("paused");
});

video.addEventListener("pause", () => {
  videoContainer.classList.add("paused");
});
