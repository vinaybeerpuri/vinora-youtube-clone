import PlayerContainer from "./PlayerContainer";
import API from "../config/api";
import { usePlayer } from "../context/PlayerContext";

import React, {
  useEffect,
  useState,
  useRef
} from "react";

import {
  useParams,
  Link,
  useNavigate
} from "react-router-dom";

import Comments from "./Comments";
import "./VideoPlayer.css";

const VideoPlayer = () => {

  const { id } = useParams();
  console.log("Video ID:", id);
  const {
    currentVideo,
    setCurrentVideo,
    player,
    minimizePlayer,
    maximizePlayer
  } = usePlayer();

  const [video, setVideo] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [likes, setLikes] = useState(0);
  const [gestureMessage, setGestureMessage] = useState("");

  // Additional Redesign states
  const [descExpanded, setDescExpanded] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [saved, setSaved] = useState(false);

  const navigate = useNavigate();

  const tapCount = useRef(0);
  const tapTimer = useRef(null);
  const touchPosition = useRef("");
  const isTouchDevice = useRef(false);
  const touchResetTimeout = useRef(null);

  // =========================
  // LOAD VIDEO
  // =========================

  useEffect(() => {
    const loadData = async () => {
      try {
        const videoRes = await fetch(`${API}/api/videos/${id}`);
        const videoData = await videoRes.json();
        setVideo(videoData);
        setCurrentVideo(videoData);
        maximizePlayer();
        setLikes(videoData.likes || 0);

        const allRes = await fetch("http://localhost:5000/api/videos");
        const allData = await allRes.json();
        setRecommended(Array.isArray(allData) ? allData : []);

        // ADD HISTORY
        const token = localStorage.getItem("token");
        if (token) {
          await fetch("http://localhost:5000/api/history", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ videoId: id })
          });
        }
      } catch (error) {
        console.log(error);
      }
    };
    loadData();
    // Reset additional UI states on video change
    setDescExpanded(false);
    setSubscribed(false);
    setDisliked(false);
    setSaved(false);
  }, [id]);

  // =========================
  // HISTORY
  // =========================

  const addHistory = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    await fetch("http://localhost:5000/api/history", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ videoId: id })
    });
  };

  // =========================
  // YOUTUBE ID
  // =========================




  // =========================
  // YOUTUBE PLAYER
  // =========================

  // =========================
  // WATCH LIMIT
  // =========================

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !player) return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch("http://localhost:5000/api/watch", {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.status === 403) {
          alert(data.message);
          player.pauseVideo();
          window.location.href = "/premium";
        }
      } catch (error) {
        console.log(error);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [player]);

  // =========================
  // LIKE VIDEO
  // =========================

  const likeVideo = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/videos/${id}/like`, { method: "PUT" });
      const data = await res.json();
      setLikes(data.likes || 0);
      setDisliked(false); // Reset dislike if liked
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // DOWNLOAD VIDEO
  // =========================

  const downloadVideo = async () => {
    const token = localStorage.getItem("token");
    if (!token) { alert("Login required"); return; }
    try {
      const res = await fetch("http://localhost:5000/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ videoId: id })
      });
      const data = await res.json();
      alert(data.message);
    } catch (error) {
      console.log(error);
    }
  };

  // =========================
  // SHARE
  // =========================

  const shareVideo = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied");
  };

  // =========================
  // GESTURES
  // =========================

  const showGestureMessage = (msg) => {
    setGestureMessage(msg);
    setTimeout(() => {
      setGestureMessage("");
    }, 1500);
  };

  const processGesture = (taps, position) => {
    // 3. Fix Player Readiness
    const isPlayerReady = player && typeof player.getCurrentTime === "function" && typeof player.seekTo === "function";
    if (!isPlayerReady) {
      console.log("Player not ready - ignoring gesture");
      return;
    }

    // SINGLE TAP
    if (taps === 1 && position === "center") {
      if (typeof player.getPlayerState === "function" &&
          typeof player.pauseVideo === "function" &&
          typeof player.playVideo === "function") {
        console.log("Gesture detected: Single Center");
        const state = player.getPlayerState();
        if (state === window.YT.PlayerState.PLAYING) {
          player.pauseVideo();
        } else {
          player.playVideo();
        }
      }
    }

    // DOUBLE TAP
    if (taps === 2) {
      const current = typeof player.getCurrentTime === "function" ? player.getCurrentTime() : 0;
      const duration = typeof player.getDuration === "function" ? player.getDuration() : 0;
      console.log("player.getCurrentTime() returned:", current);
      console.log("player.getDuration() returned:", duration);

      if (position === "right") {
        console.log("Gesture detected: Double Right");
        const targetTime = duration > 0 ? Math.min(current + 10, duration) : current + 10;
        console.log(`Calling player.seekTo() with targetTime: ${targetTime}`);
        player.seekTo(targetTime, true);
        showGestureMessage("⏩ +10 sec");
      }
      if (position === "left") {
        console.log("Gesture detected: Double Left");
        const targetTime = Math.max(current - 10, 0);
        console.log(`Calling player.seekTo() with targetTime: ${targetTime}`);
        player.seekTo(targetTime, true);
        showGestureMessage("⏪ -10 sec");
      }
    }

    // TRIPLE TAP
    if (taps === 3) {
      if (position === "left") {
        console.log("Gesture detected: Triple Left");
        document.getElementById("comments")?.scrollIntoView({ behavior: "smooth" });
        showGestureMessage("💬 Comments");
      }
      if (position === "center") {
        console.log("Gesture detected: Triple Center");
        const nextVideos = recommended.filter((v) => video && v._id !== video._id);
        if (nextVideos.length > 0) {
          const nextVideo = nextVideos[0];
          navigate(`/video/${nextVideo._id}`);
          showGestureMessage("⏭️ Next Video");
        } else {
          showGestureMessage("No recommended videos");
        }
      }
      if (position === "right") {
        console.log("Gesture detected: Triple Right");
        showGestureMessage("🏠 Go Home & Minimize");
        navigate("/");
      }
    }
  };

  const handlePointerDown = (e) => {
    if (!player) return;

    if (e.pointerType === "touch" || isTouchDevice.current) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;

    let position;
    if (x < rect.width / 3) { position = "left"; }
    else if (x > (rect.width * 2) / 3) { position = "right"; }
    else { position = "center"; }

    tapCount.current++;
    clearTimeout(tapTimer.current);

    tapTimer.current = setTimeout(() => {
      const taps = tapCount.current;
      tapCount.current = 0;
      processGesture(taps, position);
    }, 450);
  };

  const handleTouchStart = (e) => {
    if (!player) return;

    isTouchDevice.current = true;
    if (touchResetTimeout.current) clearTimeout(touchResetTimeout.current);
    touchResetTimeout.current = setTimeout(() => {
      isTouchDevice.current = false;
    }, 1500);

    const touch = e.touches[0];
    const rect = e.currentTarget.getBoundingClientRect();
    const x = touch.clientX - rect.left;

    if (x < rect.width / 3) { touchPosition.current = "left"; }
    else if (x > (rect.width * 2) / 3) { touchPosition.current = "right"; }
    else { touchPosition.current = "center"; }

    tapCount.current++;
    clearTimeout(tapTimer.current);

    tapTimer.current = setTimeout(() => {
      const taps = tapCount.current;
      tapCount.current = 0;
      const position = touchPosition.current;
      processGesture(taps, position);
    }, 450);
  };

  // =========================
  // RENDER HELPERS
  // =========================
  useEffect(() => {

    maximizePlayer();

    return () => {
      minimizePlayer();
    };

  }, []);
  if (!video) {
    return <div className="vp-loading">Loading...</div>;
  }

  const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
    video.channel || "V"
  )}&backgroundColor=e50914`;

  // Dynamic formatted date string
  const formattedDate = new Date(video.createdAt || Date.now()).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric"
  });


  return (
    <div className="vp-page">
      <div className="vp-layout">

        {/* MAIN VIDEO COLUMN */}
        <div className="vp-main">

          {/* PLAYER COMPONENT */}
          <div className="vp-player-wrap">

            <div
              className="vp-player-container"
              onDoubleClick={(e) => e.preventDefault()}
            >

              <PlayerContainer />

              <div
                className="vp-touch-layer"
                onPointerDown={handlePointerDown}
                onTouchStart={handleTouchStart}
              />

            </div>

            {gestureMessage && (
              <div className="vp-gesture-overlay">
                {gestureMessage}
              </div>
            )}

          </div>

          {/* VIDEO METADATA */}
          <div className="vp-metadata">
            <h2 className="vp-title">{video.title}</h2>
            <p className="vp-stats-row">
              {video.views} views â€¢ {formattedDate}
            </p>
          </div>

          {/* ACTION BUTTON PILLS */}
          <div className="vp-actions">
            {/* Split Pill: Like & Dislike */}
            <div className="vp-split-pill-group">
              <button className="vp-split-pill-left" onClick={likeVideo}>
                <svg viewBox="0 0 24 24">
                  <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z" />
                </svg>
                <span>{likes}</span>
              </button>
              <button
                className="vp-split-pill-right"
                onClick={() => setDisliked(!disliked)}
                style={{ color: disliked ? "#e50914" : "" }}
              >
                <svg viewBox="0 0 24 24">
                  <path d="M23 3h-4v12h4V3zM1 14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2H6c-.83 0-1.54.5-1.84 1.22L1.14 11.27c-.09.23-.14.47-.14.73v2z" />
                </svg>
              </button>
            </div>

            {/* Share Pill */}
            <button className="vp-pill" onClick={shareVideo}>
              <svg viewBox="0 0 24 24">
                <path d="M14 9V5l7 7-7 7v-4.1c-5 0-8.5 1.6-11 5.1 1-5 4-10 11-11z" />
              </svg>
              <span>Share</span>
            </button>

            {/* Download Pill */}
            <button className="vp-pill" onClick={downloadVideo}>
              <svg viewBox="0 0 24 24">
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z" />
              </svg>
              <span>Download</span>
            </button>

            {/* Save Pill */}
            <button
              className="vp-pill"
              onClick={() => setSaved(!saved)}
              style={{ color: saved ? "#3ea6ff" : "" }}
            >
              <svg viewBox="0 0 24 24">
                <path d="M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z" />
              </svg>
              <span>{saved ? "Saved" : "Save"}</span>
            </button>
          </div>

          {/* CHANNEL SECTION */}
          <div className="vp-channel-bar">
            <div className="vp-channel-left">
              <img className="vp-channel-avatar" src={avatarUrl} alt={video.channel} />
              <div className="vp-channel-meta">
                <h3 className="vp-channel-name">{video.channel}</h3>
                <span className="vp-channel-subs">
                  {video.subscribers || "1.25M"} subscribers
                </span>
              </div>
            </div>
            <button
              className={`vp-subscribe-btn ${subscribed ? "subscribed" : ""}`}
              onClick={() => setSubscribed(!subscribed)}
            >
              {subscribed ? "Subscribed" : "Subscribe"}
            </button>
          </div>

          {/* DESCRIPTION CARD */}
          <div className="vp-description-card" onClick={() => setDescExpanded(!descExpanded)}>
            <div className="vp-desc-header">
              <span>{video.views} views</span>
              <span>{formattedDate}</span>
            </div>
            <p className="vp-desc-text">
              {descExpanded
                ? `Welcome to VINORA. Enjoy watching this video. All gesture controls, playlists, history logs and video details are fully initialized for the channel creator.`
                : `Welcome to VINORA. Enjoy watching this video...`}
            </p>
            <button className="vp-desc-more-btn">
              {descExpanded ? "Show less" : "...more"}
            </button>
          </div>

          {/* COMMENTS SECTION */}
          <div id="comments">
            <Comments videoId={id} />
          </div>

        </div>

        {/* RECOMMENDED COLUMN */}
        <div className="vp-recommended">
          <h3>Recommended</h3>
          {recommended
            .filter((v) => v._id !== video._id)
            .map((v) => (
              <Link key={v._id} to={`/video/${v._id}`} className="vp-rec-card">
                <div className="vp-rec-thumb-wrap">
                  <img src={v.thumbnail} alt={v.title} className="vp-rec-thumb" />
                </div>
                <div className="vp-rec-info">
                  <h4 className="vp-rec-title">{v.title}</h4>
                  <p className="vp-rec-meta">
                    {v.channel}<br />
                    {v.views} views
                  </p>
                </div>
              </Link>
            ))
          }
        </div>

      </div>
    </div>
  );
};

export default VideoPlayer;
