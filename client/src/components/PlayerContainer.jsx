import { useEffect } from "react";
import { usePlayer } from "../context/PlayerContext";

function PlayerContainer() {

    const {
        player,
        setPlayer,
        currentVideo,
        isMiniPlayer,
        setIsPlaying,
    } = usePlayer();

    // -----------------------------
    // Extract YouTube Video ID
    // -----------------------------
    const getYoutubeId = (url) => {

        if (!url) return "";

        if (url.includes("v="))
            return url.split("v=")[1].split("&")[0];

        if (url.includes("youtu.be/"))
            return url.split("youtu.be/")[1].split("?")[0];

        return "";
    };

    // -----------------------------
    // Create / Update Global Player
    // -----------------------------
    useEffect(() => {

        if (!currentVideo) return;

        const youtubeId = getYoutubeId(currentVideo.videoUrl);

        // Player already exists
        if (player) {

            console.log("Existing player found");
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

    }, [currentVideo, player]);
    // -----------------------------
    // Hide when no video selected
    // -----------------------------
    if (!currentVideo) return null;

    return (

        <div
            style={{
                position: isMiniPlayer ? "fixed" : "fixed",
                top: isMiniPlayer ? "auto" : "70px",

                bottom: isMiniPlayer ? "80px" : "auto",
                right: isMiniPlayer ? "20px" : "0",

                width: isMiniPlayer ? "340px" : "100vw",
                height: isMiniPlayer ? "190px" : "500px",
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