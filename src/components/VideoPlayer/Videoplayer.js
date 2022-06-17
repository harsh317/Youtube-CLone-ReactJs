import React, { useState, useRef, useEffect } from "react";
import {
  AiOutlinePlayCircle,
  AiOutlinePauseCircle,
  AiOutlineFullscreen,
  AiOutlineFullscreenExit,
} from "react-icons/ai";
import { CgMiniPlayer } from "react-icons/cg";
import { FaVolumeMute, FaVolumeUp, FaVolumeDown } from "react-icons/fa";

import "./_videoplayer.scss";

function Videoplayer({ vidsrc, duration }) {
  const [isActive, setActive] = useState(false);
  const [isActiveFullScreen, setFullScreen] = useState(false);
  const [isActiveMiniplayer, setisActiveMiniplayer] = useState(false);
  const [IsScrubbing, setisActiveScrubbing] = useState(false);
  const [rangeval, setRangeval] = useState(1);
  const [TimeShow, setTimeShow] = useState(0);
  const vidRef = useRef(null);
  const divContainer = useRef(null);
  const timelineContainer = useRef(null);
  const SliderRef = useRef(1);
  const SpeedButtonRef = useRef(1);

  let scubbing = false;
  const toggleScrubbing = (e) => {
    const rect = timelineContainer.current.getBoundingClientRect();
    const percent =
      Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
    scubbing = (e.buttons & 1) === 1;
    setisActiveScrubbing(scubbing);
    if (!scubbing) {
      vidRef.current.currentTime = percent * vidRef.current.duration;
    }
    handletimelineUpdate(e);
  };

  const handlePlayVideo = () => {
    setActive(!isActive);
    if (vidRef.current.paused) {
      vidRef.current.play();
      setActive(false);
    } else {
      vidRef.current.pause();
      setActive(true);
    }
  };

  const handler = (e) => {
    const tagname = document.activeElement.tagName.toLowerCase();
    if (tagname === "input") return;
    switch (e.key.toLowerCase()) {
      case " ":
        if (tagname === "button") return;
      case "k":
        handlePlayVideo();
        break;
      case "f":
        togglefullscreen();
        break;
      case "i":
        toggleminiplayer();
        break;
      case "arrowleft":
      case "j":
        skip(-5);
        break;
      case "arrowright":
      case "l":
        skip(5);
        break;
    }
  };

  const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
    minimumIntegerDigits: 2,
  });

  function formatDuration(time) {
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

  useEffect(() => {
    document.addEventListener("keydown", handler);
    document.addEventListener("enterpictureinpicture", () => {
      setisActiveMiniplayer(!isActiveMiniplayer);
    });

    vidRef.current.addEventListener("volumechange", () => {
      SliderRef.current.value = vidRef.current.volume;
      let VolumeLevel;
      if (vidRef.current.muted || vidRef.current.volume === 0) {
        setRangeval(0);
        SliderRef.current.value = 0;
        VolumeLevel = "muted";
      } else if (vidRef.current.volume >= 0.5) {
        VolumeLevel = "high";
      } else {
        VolumeLevel = "low";
      }
      console.log("cheese");
      divContainer.current.setAttribute("data-volume", VolumeLevel);
    });

    vidRef.current.addEventListener("timeupdate", () => {
      setTimeShow(formatDuration(vidRef.current.currentTime));
      const percent = vidRef.current.currentTime / vidRef.current.duration;
      timelineContainer.current.style.setProperty(
        "--progress-position",
        percent
      );
    });

    timelineContainer.current.addEventListener("mouseup", (e) => {
      toggleScrubbing(e);
    });
    document.addEventListener("mousemove", (e) => {
      if (scubbing) handletimelineUpdate(e);
    });

    timelineContainer.current.addEventListener(
      "mousemove",
      handletimelineUpdate
    );

    timelineContainer.current.addEventListener("mousedown", toggleScrubbing);
  }, []);

  const pauseplayclass = isActive ? "paused" : "play";
  const fullscreenclass = isActiveFullScreen ? "fullscreen" : "notfullscreen";
  const miniplayerclass = isActiveMiniplayer ? "miniplayer" : "notminiplayer";
  const scrubbingclass = IsScrubbing ? "scrubbing" : "notScrubbing";

  const skip = (duration) => {
    vidRef.current.currentTime += duration;
  };

  const togglefullscreen = () => {
    if (document.fullscreenElement == null) {
      divContainer.current.requestFullscreen();
      setFullScreen(!isActiveFullScreen);
    } else {
      document.exitFullscreen();
      setFullScreen(!isActiveFullScreen);
    }
  };

  const toggleminiplayer = () => {
    if (divContainer.current.classList.contains("miniplayer")) {
      document.exitPictureInPicture();
    } else {
      vidRef.current.requestPictureInPicture();
    }
  };

  const togglemute = () => {
    vidRef.current.muted = !vidRef.current.muted;
  };

  const handletimelineUpdate = (e) => {
    const rect = timelineContainer.current.getBoundingClientRect();
    const percent =
      Math.min(Math.max(0, e.x - rect.x), rect.width) / rect.width;
    timelineContainer.current.style.setProperty("--preview-position", percent);

    if (scubbing) {
      e.preventDefault();
      timelineContainer.current.style.setProperty(
        "--progress-position",
        percent
      );
    }
  };

  const handlespeedbtn = () => {
    let newplaybackRate = vidRef.current.playbackRate + 0.25;
    console.log(newplaybackRate);
    if (newplaybackRate > 2) {
      newplaybackRate = 0.25;
    }
    vidRef.current.playbackRate = newplaybackRate;
    SpeedButtonRef.current.innerText = `${newplaybackRate}x`;
  };
  return (
    <div>
      <div
        ref={divContainer}
        className={`video_container ${pauseplayclass}  ${fullscreenclass} ${miniplayerclass} ${scrubbingclass}`}
        data-volume="high"
      >
        <div className="video_container_controls">
          <div className="timeline-container" ref={timelineContainer}>
            <div className="timeline">
              <div className="thumb-indicator"></div>
            </div>
          </div>
          <div className="controls">
            <button
              className="play-pause-btn"
              onClick={() => {
                setActive(!isActive);
                handlePlayVideo();
              }}
            >
              <AiOutlinePlayCircle size={30} className="play-icon" />
              <AiOutlinePauseCircle size={30} className="pause-icon" />
            </button>
            <div className="volume-container">
              <button className="mute-btn" onClick={togglemute}>
                <FaVolumeUp className="volume-high" size={26} />
                <FaVolumeDown className="volume-low" size={26} />
                <FaVolumeMute className="volume-muted" size={26} />
              </button>
              <input
                className="volume-slider"
                type="range"
                min="0"
                max="1"
                step="any"
                ref={SliderRef}
                onChange={(event) => {
                  setRangeval(event.target.value);
                  vidRef.current.volume = event.target.value;
                  vidRef.current.muted = event.target.value === 0;
                }}
                value={rangeval}
              />
            </div>
            <div className="duration_container">
              <div className="current-time">{TimeShow}</div>/
              <div className="total-time">{duration}</div>
            </div>
            <button
              ref={SpeedButtonRef}
              onClick={handlespeedbtn}
              className="wide-btn"
            >
              1x
            </button>
            <button className="mini-theater-btn" onClick={toggleminiplayer}>
              <CgMiniPlayer size={30} />
            </button>
            <button className="fullscreen-btn" onClick={togglefullscreen}>
              <AiOutlineFullscreen size={30} className="open" />
              <AiOutlineFullscreenExit size={30} className="close" />
            </button>
          </div>
        </div>
        <video
          onClick={() => {
            handlePlayVideo();
          }}
          autoPlay
          muted
          preload="auto"
          ref={vidRef}
          src={`http://localhost:5000/${vidsrc}`}
        ></video>
      </div>
    </div>
  );
}

export default Videoplayer;
