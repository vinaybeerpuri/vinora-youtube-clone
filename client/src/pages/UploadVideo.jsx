import React, { useState } from "react";
import { useNavigate } from "react-router-dom";


const UploadVideo = () => {


    const navigate = useNavigate();


    const [video, setVideo] = useState({

        title: "",
        thumbnail: "",
        channel: "",
        views: "0",
        videoUrl: ""

    });



    const handleChange = (e) => {

        setVideo({

            ...video,

            [e.target.name]: e.target.value

        });

    };




    const handleSubmit = async (e) => {

        e.preventDefault();


        try {


            const response =
                await fetch(
                    "http://localhost:5000/api/videos",
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },


                        body:
                            JSON.stringify(video)

                    }
                );



            const data =
                await response.json();



            console.log(
                "UPLOAD RESPONSE:",
                data
            );



            if (response.ok) {

                alert(
                    "Video Uploaded Successfully"
                );


                navigate("/");


            }
            else {

                alert(data.message);

            }



        }

        catch (error) {

            console.log(error);

        }


    };





    return (

        <div

            style={{

                background: "#0f0f0f",

                minHeight: "100vh",

                color: "white",

                padding: "40px"

            }}

        >



            <h1>
                Upload Video
            </h1>




            <form

                onSubmit={handleSubmit}

                style={{

                    width: "500px",

                    background: "#181818",

                    padding: "25px",

                    borderRadius: "15px"

                }}

            >




                <input

                    name="title"

                    placeholder="Video Title"

                    value={video.title}

                    onChange={handleChange}

                />



                <br /><br />




                <input

                    name="thumbnail"

                    placeholder="Thumbnail URL"

                    value={video.thumbnail}

                    onChange={handleChange}

                />



                <br /><br />




                <input

                    name="channel"

                    placeholder="Channel Name"

                    value={video.channel}

                    onChange={handleChange}

                />



                <br /><br />




                <input

                    name="videoUrl"

                    placeholder="Video URL"

                    value={video.videoUrl}

                    onChange={handleChange}

                />



                <br /><br />




                <button

                    style={{

                        background: "red",

                        color: "white",

                        padding: "12px 25px",

                        border: "none",

                        cursor: "pointer"

                    }}

                >

                    Upload

                </button>




            </form>




        </div>

    );

};


export default UploadVideo;