/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable no-fallthrough */
import React, { ChangeEvent, useEffect, useState } from "react";
import { AspectRatio } from "./ui/aspect-ratio";

export const VideoPlayer = ({ videoUrl }: { videoUrl: string }) => {
  // Video player
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const videoContainerRef = React.useRef<HTMLDivElement | null>(null);
  // View mode
  const fullScreenRef = React.useRef<HTMLButtonElement | null>(null);
  const miniPlayerRef = React.useRef<HTMLButtonElement | null>(null);
  // Volume
  const muteBtnRef = React.useRef<HTMLButtonElement | null>(null);
  const volumeSliderRef = React.useRef<HTMLInputElement | null>(null);
  // Time
  const currentTimeRef = React.useRef<HTMLDivElement | null>(null);
  const totalTimeRef = React.useRef<HTMLDivElement | null>(null);
  // Captions
  const captionsBtnRef = React.useRef<HTMLButtonElement | null>(null);
  // Speed
  const speedBtnRef = React.useRef<HTMLButtonElement | null>(null);
  // Timeline
  const thumbnailImgRef = React.useRef<HTMLImageElement | null>(null);
  const previewImgRef = React.useRef<HTMLImageElement | null>(null);
  const timelineContainerRef = React.useRef<HTMLDivElement | null>(null);
  const SectionRef = React.useRef<HTMLDivElement | null>(null);

  const [sliderValue, setSliderValue] = useState(1);

  function getVideoType(url: string) {
    const parts = url.split(".");
    const extension = parts.length > 0 ? parts.pop()!.toLowerCase() : "";
    const mimeTypes: Record<string, string> = {
      mp4: "video/mp4",
      webm: "video/webm",
      ogg: "video/ogg",
      mov: "video/mov",
    };
    return mimeTypes[extension as keyof typeof mimeTypes] || "video/mp4";
  }

  function togglePlayPause() {
    const video = videoRef.current!;

    if (video && video.paused) {
      video.play();
    } else {
      video.pause();
    }
  }

  const handleSliderChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSliderValue(Number(event.target.value));
  };

  function toggleCaptions() {
    const videoElement = videoRef.current!;
    const videoContainerElement = videoContainerRef.current!;

    const captions = videoElement.textTracks[0];

    const isHidden = captions.mode === "hidden";
    captions.mode = isHidden ? "showing" : "hidden";

    videoContainerElement.classList.toggle("captions", isHidden);
  }

  function toggleMute() {
    const video = videoRef.current!;

    video.muted = !video.muted;
  }

  function changePlaybackSpeed() {
    const videoElement = videoRef.current!;
    const speedBtnElement = speedBtnRef.current!;

    let newPlaybackRate = videoElement.playbackRate + 0.25;
    if (newPlaybackRate > 2) newPlaybackRate = 0.25;

    videoElement.playbackRate = newPlaybackRate;
    speedBtnElement.textContent = `${newPlaybackRate}x`;
  }

  useEffect(() => {
    // Video player
    const videoElement = videoRef.current!;
    const videoContainerElement = videoContainerRef.current!;
    // View mode
    const fullscreenElement = fullScreenRef.current;
    const miniPlayerElement = miniPlayerRef.current;
    // Speed
    const speedBtnElement = speedBtnRef.current!;
    // Volume
    const muteBtnElement = muteBtnRef.current!;
    const volumeSliderElement = volumeSliderRef.current!;
    // Time
    const totalTimeElement = totalTimeRef.current!;
    const currentTimeElement = currentTimeRef.current!;
    // Captions
    const captionsBtnElement = captionsBtnRef.current!;
    // Timeline
    const timelineContainerElement = timelineContainerRef.current!;
    const thumbnailImgElement = thumbnailImgRef.current!;
    const previewImgElement = previewImgRef.current!;

    let isScrubbing = false;
    let wasPaused = false;
    function toggleScrubbling(e: MouseEvent) {
      const rect = timelineContainerElement.getBoundingClientRect();
      const percent =
        Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;

      isScrubbing = (e.buttons & 1) === 1;
      videoContainerElement.classList.toggle("scrubbing", isScrubbing);

      if (isScrubbing) {
        wasPaused = videoElement.paused;
        videoElement.pause();
      } else {
        videoElement.currentTime = percent * videoElement.duration;
        if (!wasPaused) videoElement.play();
      }

      handleTimelineUpdate(e);
    }

    function handleTimelineUpdate(e: MouseEvent) {
      const rect = timelineContainerElement.getBoundingClientRect();
      const percent =
        Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
      // const previewImgNumber = Math.max(
      //   1,
      //   Math.floor((percent * videoElement.duration) / 10)
      // );
      // const previewImgSrc = `assets/previewImgs/preview${previewImgNumber}.jpg`;
      const previewImgSrc = ``;

      previewImgElement.src = previewImgSrc;
      timelineContainerElement.style.setProperty(
        "--preview-position",
        String(percent),
      );

      if (isScrubbing) {
        e.preventDefault();
        thumbnailImgElement.src = previewImgSrc;
        timelineContainerElement.style.setProperty(
          "--progress-position",
          String(percent),
        );
      }
    }

    function formatDuration(time: number) {
      const seconds = Math.floor(time % 60);
      const minutes = Math.floor(time / 60) % 60;
      const hours = Math.floor(time / 3600);

      if (hours === 0) {
        return `${minutes}:${leadingZeroFormatter.format(seconds)}`;
      } else {
        return `${hours}${leadingZeroFormatter.format(
          minutes,
        )}:${leadingZeroFormatter.format(seconds)}`;
      }
    }

    const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
      minimumIntegerDigits: 2,
    });

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

    function skip(duration: number) {
      const videoElement = videoRef.current!;

      videoElement.currentTime += duration;
    }

    if (videoRef.current && videoContainerRef.current) {
      // Timeline
      timelineContainerElement.addEventListener(
        "mousemove",
        handleTimelineUpdate,
      );
      timelineContainerElement.addEventListener("mousedown", toggleScrubbling);

      document.addEventListener("mouseup", (e) => {
        if (isScrubbing) toggleScrubbling(e);
      });

      document.addEventListener("mousemove", (e) => {
        if (isScrubbing) handleTimelineUpdate(e);
      });

      // Playback Speed
      speedBtnElement.addEventListener("click", changePlaybackSpeed);

      // Captions
      // videoElement.textTracks[0].mode = "hidden";
      captionsBtnElement.addEventListener("click", toggleCaptions);

      // Duration
      videoElement.addEventListener("loadeddata", () => {
        totalTimeElement.textContent = formatDuration(videoElement.duration);
      });

      videoElement.addEventListener("timeupdate", () => {
        currentTimeElement.textContent = formatDuration(
          videoElement.currentTime,
        );
        const percent = videoElement.currentTime / videoElement.duration;
        timelineContainerElement.style.setProperty(
          "--progress-position",
          String(percent),
        );
      });

      // Volume
      muteBtnElement.addEventListener("click", toggleMute);
      volumeSliderElement.addEventListener("input", (e) => {
        const inputElement = e.target as HTMLInputElement;
        videoElement.volume = parseFloat(inputElement.value);
        videoElement.muted = parseFloat(inputElement.value) === 0;
      });

      videoElement.addEventListener("volumechange", () => {
        volumeSliderElement.value = String(videoElement.volume);

        let volumeLevel;
        if (videoElement.muted || videoElement?.volume === 0) {
          volumeSliderElement.value = String(0);
          volumeLevel = "muted";
        } else if (videoElement.volume >= 0.5) {
          volumeLevel = "high";
        } else {
          volumeLevel = "low";
        }

        videoContainerElement.dataset.volumeLevel = volumeLevel;
      });

      // View Modes
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

      // Video controls
      videoElement.addEventListener("play", () => {
        videoContainerElement.classList.remove("paused");
      });

      videoElement.addEventListener("pause", () => {
        videoContainerElement.classList.add("paused");
      });

      // Keyboard shotcuts
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
      className="video-container paused w-[full] drop-shadow-lg"
      data-volume-level="high"
    >
      <img className="thumbnail-img" ref={thumbnailImgRef} />
      <div className="video-controls-container">
        <div className="timeline-container" ref={timelineContainerRef}>
          <div className="timeline">
            <img className="preview-img" ref={previewImgRef} />
            <div className="thumb-indicator"></div>
          </div>
          <div className="section" ref={SectionRef}></div>
        </div>
        <div className="controls">
          <button className="play-pause-btn" onClick={togglePlayPause}>
            <svg
              width="35"
              height="35"
              className="play-icon"
              viewBox="0 0 24 24"
            >
              <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
            </svg>
            <svg
              width="35"
              height="35"
              className="pause-icon"
              viewBox="0 0 24 24"
            >
              <path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" />
            </svg>
          </button>
          <div className="volume-container">
            <button ref={muteBtnRef} className="mute-btn">
              <svg
                width="26"
                height="26"
                className="volume-high-icon"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"
                />
              </svg>
              <svg
                width="26"
                height="26"
                className="volume-low-icon"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z"
                />
              </svg>
              <svg
                width="26"
                height="26"
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
              ref={volumeSliderRef}
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={sliderValue}
              onChange={handleSliderChange}
            />{" "}
          </div>
          <div className="duration-container">
            <div ref={currentTimeRef} className="current-time">
              0:00
            </div>
            /<div ref={totalTimeRef} className="total-time"></div>
          </div>
          <button className="captions-btn" ref={captionsBtnRef}>
            <svg width="30" height="30" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M18,11H16.5V10.5H14.5V13.5H16.5V13H18V14A1,1 0 0,1 17,15H14A1,1 0 0,1 13,14V10A1,1 0 0,1 14,9H17A1,1 0 0,1 18,10M11,11H9.5V10.5H7.5V13.5H9.5V13H11V14A1,1 0 0,1 10,15H7A1,1 0 0,1 6,14V10A1,1 0 0,1 7,9H10A1,1 0 0,1 11,10M19,4H5C3.89,4 3,4.89 3,6V18A2,2 0 0,0 5,20H19A2,2 0 0,0 21,18V6C21,4.89 20.1,4 19,4Z"
              />
            </svg>
          </button>
          <button className="speed-btn wide-btn" ref={speedBtnRef}>
            1x
          </button>
          <button ref={miniPlayerRef} className="mini-player-btn">
            <svg width="28" height="28" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3V5h18v14zm-10-7h9v6h-9z"
              />
            </svg>
          </button>
          <button ref={fullScreenRef} className="full-screen-btn">
            <svg className="open" width="35" height="35" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
              />
            </svg>
            <svg className="close" width="35" height="35" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"
              />
            </svg>
          </button>
        </div>
      </div>
      {videoUrl && (
        <AspectRatio ratio={16 / 9}>
          <video
            ref={videoRef}
            className="video-player"
            onClick={togglePlayPause}
            style={{ objectFit: "contain", width: "100%", height: "100%" }}
          >
            {/* <track kind={"captions"} srcLang="en" src="subtitles.vtt" /> */}
            <source src={videoUrl} type={getVideoType(videoUrl)} />{" "}
          </video>
        </AspectRatio>
      )}
    </div>
  );
};
