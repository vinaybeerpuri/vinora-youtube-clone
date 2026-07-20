import PlayerContainer from "./PlayerContainer";
import API from "../config/api";
import { usePlayer } from "../context/PlayerContext";

import React, {
  useEffect,
  useState,
  useRef,
  useCallback
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
    setCurrentVideo,
    player,
    minimizePlayer,
    maximizePlayer,
    closePlayer
  } = usePlayer();

  const [video, setVideo] = useState(null);
  const [recommended, setRecommended] = useState([]);
  const [likes, setLikes] = useState(0);
  const [gestureMessage, setGestureMessage] = useState(null);
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const getUserId = () => user?._id || user?.id;
  const isLikedByUser = (likedBy = [], userId) => {
    if (!userId) return false;
    return likedBy.some((uid) => String(uid) === String(userId));
  };

  const videoRef = useRef(null);
  const recommendedRef = useRef([]);
  const playerRef = useRef(null);

  useEffect(() => {
    videoRef.current = video;
    recommendedRef.current = recommended;
  }, [video, recommended]);

  // Additional Redesign states
  const [descExpanded, setDescExpanded] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [saved, setSaved] = useState(false);

  const navigate = useNavigate();

  const tapPositions = useRef([]);
  const tapTimer = useRef(null);
  const pointerTracker = useRef({
    pointerId: null,
    startX: 0,
    startY: 0,
    isValid: false
  });
  const gestureTimeout = useRef(null);

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
        setLikes(
          Array.isArray(videoData.likedBy)
            ? videoData.likedBy.length
            : videoData.likes || 0
        );

        const allRes = await fetch(`${API}/api/videos`); const allData = await allRes.json();
        setRecommended(Array.isArray(allData) ? allData : []);

        // ADD HISTORY
        const token = localStorage.getItem("token");
        if (token) {
          await fetch(`${API}/api/history`, {
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
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps
  // =========================
  // HISTORY
  // =========================



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
        const res = await fetch(`${API}/api/watch`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`
          }
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
    const token = localStorage.getItem("token");
    const userId = getUserId();
    if (!token) {
      alert("Login required to like videos");
      return;
    }
    if (!userId) {
      alert("Login required to like videos");
      return;
    }

    const isAlreadyLiked = isLikedByUser(video?.likedBy, userId);
    let updatedLikedBy = video?.likedBy ? [...video.likedBy] : [];
    if (isAlreadyLiked) {
      updatedLikedBy = updatedLikedBy.filter(
        (uid) => String(uid) !== String(userId)
      );
    } else {
      updatedLikedBy.push(userId);
    }

    const previousLikes = likes;
    const previousLikedBy = video?.likedBy || [];

    setLikes(updatedLikedBy.length);
    setVideo((prev) => ({
      ...prev,
      likedBy: updatedLikedBy,
      likes: updatedLikedBy.length
    }));
    setDisliked(false);

    try {
      const res = await fetch(`${API}/api/videos/${id}/like`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to sync like with server");
      }
      setLikes(data.likes ?? 0);
      setVideo((prev) => ({
        ...prev,
        likes: data.likes ?? 0,
        likedBy: data.likedBy || []
      }));
    } catch (error) {
      console.log(error);
      setLikes(previousLikes);
      setVideo((prev) => ({
        ...prev,
        likedBy: previousLikedBy,
        likes: previousLikes
      }));
    }
  };

  // =========================
  // DOWNLOAD VIDEO
  // =========================

  const downloadVideo = async () => {
    const token = localStorage.getItem("token");
    if (!token) { alert("Login required"); return; }
    try {
      const res = await fetch(`${API}/api/download`, {
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

  // Keep a ref to the latest player so processGesture always reads the current
  // instance even when called from inside the 300 ms debounce timer.
  useEffect(() => {
    playerRef.current = player;
  }, [player]);

  const showGestureMessage = useCallback((text, side = "center") => {
    if (gestureTimeout.current) {
      clearTimeout(gestureTimeout.current);
    }
    setGestureMessage({ text, side });
    gestureTimeout.current = setTimeout(() => {
      setGestureMessage(null);
      gestureTimeout.current = null;
    }, 1500);
  }, []);

  // processGesture reads player/video/recommended through refs so it always
  // sees the current values regardless of when the 300 ms timer fires.
  const processGesture = useCallback((positions) => {
    const count = positions.length;
    if (count === 0) return;

    const p = playerRef.current;
    if (
      !p ||
      typeof p.getCurrentTime !== "function" ||
      typeof p.seekTo !== "function" ||
      typeof p.playVideo !== "function" ||
      typeof p.pauseVideo !== "function"
    ) {
      return;
    }

    // SINGLE TAP – center only
    if (count === 1) {
      if (positions[0] === "center") {
        const state = typeof p.getPlayerState === "function" ? p.getPlayerState() : -1;
        if (state === window.YT.PlayerState.PLAYING) {
          p.pauseVideo();
        } else {
          p.playVideo();
        }
      }
    }

    // DOUBLE TAP – left / right only
    if (count === 2) {
      const current  = p.getCurrentTime();
      const duration = typeof p.getDuration === "function" ? p.getDuration() : 0;
      if (positions[0] === "right" && positions[1] === "right") {
        const targetTime = duration > 0 ? Math.min(current + 10, duration) : current + 10;
        p.seekTo(targetTime, true);
        showGestureMessage(">10", "right");
      } else if (positions[0] === "left" && positions[1] === "left") {
        const targetTime = Math.max(current - 10, 0);
        p.seekTo(targetTime, true);
        showGestureMessage("<10", "left");
      }
    }

    // TRIPLE TAP – left / center / right
    if (count === 3) {
      const allLeft   = positions.every((pos) => pos === "left");
      const allCenter = positions.every((pos) => pos === "center");
      const allRight  = positions.every((pos) => pos === "right");

      if (allLeft) {
        document.getElementById("comments")?.scrollIntoView({ behavior: "smooth" });
      } else if (allCenter) {
        const currentVideo       = videoRef.current;
        const currentRecommended = recommendedRef.current;
        const nextVideos = currentRecommended.filter(
          (v) => currentVideo && v._id !== currentVideo._id
        );
        if (nextVideos.length > 0) {
          navigate(`/video/${nextVideos[0]._id}`);
        }
      } else if (allRight) {
        closePlayer();
        setTimeout(() => {
          window.close();
          window.location.href = "about:blank";
        }, 800);
      }
    }
  }, [navigate, showGestureMessage]); // eslint-disable-line react-hooks/exhaustive-deps

  const registerTap = useCallback((position) => {
    tapPositions.current.push(position);

    if (tapTimer.current) {
      clearTimeout(tapTimer.current);
      tapTimer.current = null;
    }

    if (tapPositions.current.length >= 3) {
      // Triple tap: fire immediately
      const finalPositions = [...tapPositions.current];
      tapPositions.current = [];
      processGesture(finalPositions);
    } else {
      // Wait 300 ms to distinguish single from double tap
      tapTimer.current = setTimeout(() => {
        const finalPositions = [...tapPositions.current];
        tapPositions.current = [];
        tapTimer.current = null;
        processGesture(finalPositions);
      }, 300);
    }
  }, [processGesture]);


  const handlePointerDown = useCallback((e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;

    // Lock all pointer events for this pointer ID to this element.
    // Without this, the YouTube cross-origin iframe steals pointermove
    // and pointerup the moment the pointer drifts over it.
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) {}

    pointerTracker.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      isValid: true,
      element: e.currentTarget,
    };
  }, []);

  const handlePointerMove = useCallback((e) => {
    const tracker = pointerTracker.current;
    if (!tracker.isValid || tracker.pointerId !== e.pointerId) return;
    const dx = e.clientX - tracker.startX;
    const dy = e.clientY - tracker.startY;
    // 20px threshold — tolerates normal tap drift on touch (5-8px) while
    // still correctly rejecting intentional swipes (>40px).
    if (Math.sqrt(dx * dx + dy * dy) > 20) {
      tracker.isValid = false;
    }
  }, []);

  const handlePointerUp = useCallback((e) => {
    const tracker = pointerTracker.current;
    if (tracker.pointerId === null || tracker.pointerId !== e.pointerId) return;

    if (tracker.isValid) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x    = e.clientX - rect.left;
      let pos    = "center";
      if (x < rect.width / 3)           pos = "left";
      else if (x > (rect.width * 2) / 3) pos = "right";
      registerTap(pos);
    }

    // Release capture so subsequent pointer events go back to the page normally.
    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (_) {}
    pointerTracker.current = { pointerId: null, startX: 0, startY: 0, isValid: false, element: null };
  }, [registerTap]);

  const handlePointerCancel = useCallback((e) => {
    const tracker = pointerTracker.current;
    if (tracker.pointerId === null || tracker.pointerId !== e.pointerId) return;

    // Browsers fire pointercancel instead of pointerup when:
    //   (a) the browser decides to scroll (even with touch-action:manipulation)
    //   (b) pointer capture is released externally
    // If the tap was still valid at cancel time, register it anyway.
    if (tracker.isValid) {
      const el = tracker.element || e.currentTarget;
      const rect = el.getBoundingClientRect();
      const x    = e.clientX - rect.left;
      let pos    = "center";
      if (x < rect.width / 3)           pos = "left";
      else if (x > (rect.width * 2) / 3) pos = "right";
      registerTap(pos);
    }

    try { e.currentTarget.releasePointerCapture(e.pointerId); } catch (_) {}
    pointerTracker.current = { pointerId: null, startX: 0, startY: 0, isValid: false, element: null };
  }, [registerTap]);



  // =========================
  // RENDER HELPERS
  // =========================
  useEffect(() => {

    maximizePlayer();

    return () => {
      minimizePlayer();
      if (tapTimer.current) {
        clearTimeout(tapTimer.current);
      }
      if (gestureTimeout.current) {
        clearTimeout(gestureTimeout.current);
      }
    };

  }, []); // eslint-disable-line react-hooks/exhaustive-deps
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

  const userId = getUserId();
  const userHasLiked = isLikedByUser(video?.likedBy, userId);
  const currentIndex = recommended.findIndex((v) => v._id === video._id);
  const prevVideo = currentIndex > 0 ? recommended[currentIndex - 1] : null;
  const nextVideo =
    currentIndex >= 0 && currentIndex < recommended.length - 1
      ? recommended[currentIndex + 1]
      : null;

  const goToVideo = (targetId) => {
    if (targetId) {
      navigate(`/video/${targetId}`);
    }
  };


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

              {/* Touch layer MUST be last child so it paints on top of the iframe */}
              <div
                className="vp-touch-layer"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerCancel}
              />

              {/* Overlay lives inside the same stacking context as the touch layer */}
              {gestureMessage && (
                <div className={`vp-gesture-overlay vp-gesture-overlay--${gestureMessage.side}`}>
                  {gestureMessage.text}
                </div>
              )}

            </div>


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
              <button
                className="vp-split-pill-left"
                onClick={likeVideo}
                style={{ color: userHasLiked ? "#3ea6ff" : "" }}
              >
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

            <button
              className="vp-pill"
              onClick={() => goToVideo(prevVideo?._id)}
              disabled={!prevVideo}
            >
              <span>Previous</span>
            </button>

            <button
              className="vp-pill"
              onClick={() => goToVideo(nextVideo?._id)}
              disabled={!nextVideo}
            >
              <span>Next</span>
            </button>

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
