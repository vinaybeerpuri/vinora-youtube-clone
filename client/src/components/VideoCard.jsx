import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./VideoCard.css";

const VideoCard = ({ video }) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  // Helper for dynamic timeago formatted string
  const timeAgo = (dateString) => {
    if (!dateString) return "2 days ago";
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4.3) return `${weeks}w ago`;
    const months = Math.floor(days / 30.4);
    if (months < 12) return `${months}mo ago`;
    const years = Math.floor(days / 365);
    return `${years}y ago`;
  };

  const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
    video.channel || "V"
  )}&backgroundColor=e50914&fontSize=42`;

  const thumbnailUrl =
    video.thumbnail && video.thumbnail.startsWith("http")
      ? video.thumbnail
      : "https://via.placeholder.com/400x225?text=No+Thumbnail";

  return (
    <Link to={`/video/${video._id}`} className="video-card-link">
      <div className="video-card">
        {/* THUMBNAIL */}
        <div className={`video-thumbnail-wrap ${!imgLoaded ? "skeleton-pulse" : ""}`}>
          <img
            src={thumbnailUrl}
            alt={video.title}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            onError={(e) => {
              e.target.src = "https://via.placeholder.com/400x225?text=No+Thumbnail";
              setImgLoaded(true);
            }}
            className={`video-thumbnail ${imgLoaded ? "loaded" : "loading"}`}
          />
          {imgLoaded && <span className="video-duration">10:20</span>}
        </div>

        {/* INFO SECTION */}
        <div className="video-info">
          {/* Channel avatar */}
          <img
            className="video-channel-avatar"
            src={avatarUrl}
            alt={video.channel}
            loading="lazy"
          />

          {/* Text contents */}
          <div className="video-text">
            <h3 className="video-title">{video.title}</h3>
            <p className="video-channel">{video.channel}</p>
            <p className="video-stats">
              {video.views} views • {timeAgo(video.createdAt)}
            </p>
          </div>

          {/* Options three-dot button (entire card stays clickable) */}
          <button
            className="video-options-btn"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            aria-label="Options"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
          </button>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;