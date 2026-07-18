import { useEffect, useRef } from "react";
import { usePlayer } from "../context/PlayerContext";

function PlayerContainer() {

    const {
        player,
        setPlayer,
        currentVideo,
        isMiniPlayer,
        setIsPlaying,
    } = usePlayer();
    const lastVideoId = useRef("");

    // -----------------------------
    // Extract YouTube Video ID
    // -----------------------------
    const getYoutubeId = (url) => {
        if (!url) return "";

        const regExp =
            /^.*(?:youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;

        const match = url.match(regExp);

        return match && match[1].length === 11
            ? match[1]
            : "";
    };

    // -----------------------------
    // Create / Update Global Player
    // -----------------------------
    useEffect(() => {

        if (!currentVideo) return;
        console.log("Current Video:", currentVideo);
        const youtubeId = getYoutubeId(currentVideo.videoUrl);

        console.log("Video URL:", currentVideo.videoUrl);
        console.log("YouTube ID:", youtubeId);


        // Player already exists
        if (player) {

            // Don't reload if the same video is already loaded
            if (lastVideoId.current === youtubeId) {
                return;
            }

            // Remember which video is loaded
            lastVideoId.current = youtubeId;

            console.log("Loading:", youtubeId);

            player.loadVideoById(youtubeId);

            player.playVideo();

            return;
        }

        const createPlayer = () => {

            console.log("Creating YouTube Player...");

            const ytPlayer = new window.YT.Player("global-player", {

                width: "100%",
                height: "100%",

                videoId: youtubeId,

                playerVars: {
                    autoplay: 1,
                    playsinline: 1,
                    rel: 0,
                    modestbranding: 1,
                },

                events: {

                    onReady: (event) => {

                        console.log("Player Ready");

                        // Save the first loaded video ID
                        lastVideoId.current = youtubeId;

                        setPlayer(event.target);

                        event.target.playVideo();

                    },

                    onStateChange: (event) => {

                        console.log("Player State:", event.data);

                        switch (event.data) {

                            case window.YT.PlayerState.PLAYING:
                                setIsPlaying(true);
                                break;

                            case window.YT.PlayerState.PAUSED:
                                setIsPlaying(false);
                                break;

                            case window.YT.PlayerState.ENDED:
                                setIsPlaying(false);
                                break;

                            default:
                                break;
                        }

                    }

                }

            });

            return ytPlayer;
        };

        if (window.YT && window.YT.Player) {

            createPlayer();

        } else {

            const oldScript = document.getElementById("youtube-api");

            if (!oldScript) {

                const script = document.createElement("script");

                script.id = "youtube-api";
                script.src = "https://www.youtube.com/iframe_api";

                document.body.appendChild(script);

            }

            window.onYouTubeIframeAPIReady = createPlayer;
        }

    }, [
        currentVideo,
        player,
        setPlayer,
        setIsPlaying,
    ]);    // -----------------------------
    if (!currentVideo) return null;

    return (

        <div
            style={{
                position: isMiniPlayer ? "fixed" : "relative", top: isMiniPlayer ? "auto" : "0",

                bottom: isMiniPlayer ? "80px" : "auto",
                right: isMiniPlayer ? "20px" : "0",

                width: isMiniPlayer ? "340px" : "100%", height: isMiniPlayer ? "190px" : "100%",
                background: "#000",

                zIndex: 9999,

                borderRadius: isMiniPlayer ? "12px" : "0",

                overflow: "hidden",

                boxShadow: isMiniPlayer
                    ? "0 8px 20px rgba(0,0,0,.35)"
                    : "none",

                transition: "all .3s ease"
            }}
        >

            <div
                id="global-player"
                style={{
                    width: "100%",
                    height: "100%"
                }}
            />

        </div>

    );

}

export default PlayerContainer;