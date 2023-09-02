/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-fallthrough */
import React, { ChangeEvent, useEffect, useState } from "react";

export const VideoPlayerTest = () => {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const videoContainerRef = React.useRef<HTMLDivElement | null>(null);
  const fullScreenRef = React.useRef<HTMLButtonElement | null>(null);
  const miniPlayerRef = React.useRef<HTMLButtonElement | null>(null);
  const muteBtn = React.useRef<HTMLButtonElement | null>(null);
  const volumeSlider = React.useRef<HTMLInputElement | null>(null);

  const [sliderValue, setSliderValue] = useState(1);

  const handleSliderChange = (event: ChangeEvent<HTMLInputElement>) => {
    // Update the state with the new value of the slider
    setSliderValue(Math.round(Number(event.target.value)));
  };
  function togglePlayPause() {
    const video = videoRef.current!;

    if (video && video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }

  function toggleFullScreenMode() {
    const container = videoContainerRef.current!;

    if (!document.fullscreenElement) {
      container.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  function toggleMiniPlayerMode() {
    const container = videoContainerRef.current!;
    const videoElement = videoRef.current!;

    if (container.classList.contains("mini-player")) {
      document.exitPictureInPicture();
    } else {
      videoElement?.requestPictureInPicture();
    }
  }

  function toggleMute() {
    const video = videoRef.current!;

    video.muted = !video.muted;
  }

  useEffect(() => {
    if (videoRef.current && videoContainerRef.current) {
      const videoElement = videoRef.current!;
      const videoContainerElement = videoContainerRef.current!;

      //Volume
      const muteBtnElement = muteBtn.current!;
      const volumeSliderElement = volumeSlider.current!;

      muteBtnElement.addEventListener("click", toggleMute);
      volumeSliderElement.addEventListener("input", (e) => {
        const inputElement = e.target as HTMLInputElement;
        videoElement.volume = parseFloat(inputElement.value);
        videoElement.muted = parseFloat(inputElement.value) === 0;
      });

      videoElement.addEventListener("volumechange", () => {
        volumeSliderElement.value = String(videoElement.volume);

        let volumeLevel;
        if (videoElement.muted || video?.volume === 0) {
          volumeSliderElement.value = String(0);
          volumeLevel = "muted";
        } else if (videoElement.volume >= 0.5) {
          volumeLevel = "high";
        } else {
          volumeLevel = "low";
        }

        videoContainerElement.dataset.volumeLevel = volumeLevel;
      });
      //view Modes
      const fullscreenElement = fullScreenRef.current;
      const miniPlayerElement = miniPlayerRef.current;

      fullscreenElement?.addEventListener("click", toggleFullScreenMode);
      miniPlayerElement?.addEventListener("click", toggleMiniPlayerMode);

      document.addEventListener("fullscreenchange", () => {
        if (document.fullscreenElement !== null) {
          videoContainerElement?.classList.toggle("full-screen", true);
        } else {
          videoContainerElement?.classList.toggle("full-screen", false);
        }
      });

      videoElement.addEventListener("enterpictureinpicture", () => {
        videoContainerElement?.classList.add("mini-player");
      });

      videoElement.addEventListener("leavepictureinpicture", () => {
        videoContainerElement?.classList.remove("mini-player");
      });

      //Video controls

      videoElement.addEventListener("play", () => {
        videoContainerElement.classList.remove("paused");
      });

      videoElement.addEventListener("pause", () => {
        videoContainerElement.classList.add("paused");
      });

      videoContainerElement.addEventListener("click", togglePlayPause);

      const handleKeyDown = (e: KeyboardEvent) => {
        const tagName = document.activeElement?.tagName.toLowerCase();
        if (tagName === "input") return;

        switch (e.key.toLowerCase()) {
          //@ts-ignore
          case " ":
            if (tagName === "button") return;
          case "k":
            togglePlayPause();
            break;
          case "f":
            toggleFullScreenMode();
            break;
          case "i":
            toggleMiniPlayerMode();
            break;
          case "m":
            toggleMute();
            break;
          default:
            break;
        }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, []);

  return (
    <div
      ref={videoContainerRef}
      className="video-container paused"
      data-volume-level="high"
    >
      <div className="video-controls-container">
        <div className="timeline-container"></div>
        <div className="controls">
          <button className="play-pause-btn" onClick={togglePlayPause}>
            <svg
              width="30"
              height="30"
              className="play-icon"
              viewBox="0 0 24 24"
            >
              <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
            </svg>
            <svg
              width="30"
              height="30"
              className="pause-icon"
              viewBox="0 0 24 24"
            >
              <path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" />
            </svg>
          </button>
          <div className="volume-container">
            <button ref={muteBtn} className="mute-btn">
              <svg
                width="30"
                height="30"
                className="volume-high-icon"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"
                />
              </svg>
              <svg
                width="30"
                height="30"
                className="volume-low-icon"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z"
                />
              </svg>
              <svg
                width="30"
                height="30"
                className="volume-muted-icon"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z"
                />
              </svg>
            </button>
            <input
              className="volume-slider"
              ref={volumeSlider}
              type="range"
              min={0}
              max={1}
              step={"any"}
              value={sliderValue}
              onChange={handleSliderChange}
            />{" "}
          </div>
          <button ref={miniPlayerRef} className="mini-player-btn">
            <svg width="30" height="30" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-10-7h9v6h-9z"
              />
            </svg>
          </button>
          <button ref={fullScreenRef} className="full-screen-btn">
            <svg className="open" width="30" height="30" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
              />
            </svg>
            <svg className="close" width="30" height="30" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"
              />
            </svg>
          </button>
        </div>
      </div>
      <video ref={videoRef} className="video-player" autoPlay>
        <source
          src="https://tecdn.b-cdn.net/img/video/Sail-Away.mp4"
          type="video/mp4"
        />
      </video>
    </div>
  );
};
