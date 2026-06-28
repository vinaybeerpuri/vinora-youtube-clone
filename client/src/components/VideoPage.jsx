import React from "react";

const VideoPage = () => {

    return (

        <div
            style={{
                padding: "20px",
                display: "flex",
                justifyContent: "center"
            }}
        >

            <div
                style={{
                    width: "800px"
                }}
            >

                <h1>Sample Video</h1>

                <video
                    width="100%"
                    controls
                    style={{
                        borderRadius: "10px"
                    }}
                >

                    <source
                        src="https://www.w3schools.com/html/mov_bbb.mp4"
                        type="video/mp4"
                    />

                </video>

            </div>

        </div>
    );
};

export default VideoPage;