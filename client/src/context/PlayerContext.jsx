import React, { createContext, useContext, useState } from "react";

const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {

    const [currentVideo, setCurrentVideo] = useState(null);

    // Global YouTube Player Instance
    const [player, setPlayer] = useState(null);

    // Player State
    const [isPlaying, setIsPlaying] = useState(false);

    // Mini Player State
    const [isMiniPlayer, setIsMiniPlayer] = useState(false);

    // Playback Time
    const [currentTime, setCurrentTime] = useState(0);

    // -------------------------
    // Mini Player Controls
    // -------------------------

    const minimizePlayer = () => {
        setIsMiniPlayer(true);
    };

    const maximizePlayer = () => {
        setIsMiniPlayer(false);
    };

    // -------------------------
    // Close Player
    // -------------------------

    const closePlayer = () => {

        if (player) {
            try {
                player.stopVideo();
            } catch (err) {
                console.log(err);
            }
        }

        setCurrentVideo(null);
        setCurrentTime(0);
        setIsPlaying(false);
        setIsMiniPlayer(false);
    };

    return (
        <PlayerContext.Provider
            value={{

                // Current Video
                currentVideo,
                setCurrentVideo,

                // Global Player
                player,
                setPlayer,

                // Playback State
                isPlaying,
                setIsPlaying,

                // Mini Player
                isMiniPlayer,
                minimizePlayer,
                maximizePlayer,

                // Current Time
                currentTime,
                setCurrentTime,

                // Close
                closePlayer

            }}
        >
            {children}
        </PlayerContext.Provider>
    );
};

export const usePlayer = () => useContext(PlayerContext);