import { useNavigate, useLocation } from "react-router-dom";
import { usePlayer } from "../context/PlayerContext";
import "./MiniPlayer.css";

function MiniPlayer() {
    const navigate = useNavigate();
    const location = useLocation();

    const {
        currentVideo,
        isPlaying,
        setIsPlaying,
        setCurrentVideo,
        player
    } = usePlayer();

    // Don't show mini player if there is no video
    if (!currentVideo) return null;

    // Don't show it on the watch page
    if (location.pathname.startsWith("/video")) return null;

    // Open full player
    const openVideo = () => {
        navigate(`/video/${currentVideo._id}`);
    };

    // Play / Pause
    const togglePlay = (e) => {
        e.stopPropagation();

        if (!player) return;

        if (isPlaying) {
            player.pauseVideo();
            setIsPlaying(false);
        } else {
            player.playVideo();
            setIsPlaying(true);
        }
    };

    // Close Mini Player
    const closePlayer = (e) => {
        e.stopPropagation();

        if (player) {
            player.stopVideo();
        }

        setCurrentVideo(null);
        setIsPlaying(false);
    };

    return (
        <div className="mini-player" onClick={openVideo}>
            <img
                src={currentVideo.thumbnail}
                alt={currentVideo.title}
            />

            <div className="mini-info">
                <h4>{currentVideo.title}</h4>
                <p>{currentVideo.channel}</p>
            </div>

            <button
                className="mini-btn"
                onClick={togglePlay}
            >
                {isPlaying ? "⏸" : "▶"}
            </button>

            <button
                className="mini-btn"
                onClick={closePlayer}
            >
                ✕
            </button>
        </div>
    );
}

export default MiniPlayer;