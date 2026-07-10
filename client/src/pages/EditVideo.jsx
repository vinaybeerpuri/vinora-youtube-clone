import React, {
    useEffect,
    useState
} from "react";

import {
    useParams,
    useNavigate
} from "react-router-dom";

import Navbar from "../components/Navbar";
import API from "../config/api";



const EditVideo = () => {


    const { id } = useParams();

    const navigate = useNavigate();


    const [video, setVideo] =
        useState({

            title: "",
            thumbnail: "",
            videoUrl: ""

        });



    const token =
        localStorage.getItem("token");





    // =========================
    // GET VIDEO DETAILS
    // =========================

    useEffect(() => {


        const fetchVideo = async () => {


            try {


                const response =
                    await fetch(
                        `${API}/api/videos/${id}`
                    );


                const data =
                    await response.json();


                setVideo({

                    title: data.title,

                    thumbnail: data.thumbnail,

                    videoUrl: data.videoUrl

                });


            }
            catch (error) {


                console.log(
                    "Fetch Video Error:",
                    error
                );


            }


        };


        fetchVideo();


    }, [id]);









    // =========================
    // HANDLE INPUT
    // =========================


    const handleChange = (e) => {


        setVideo({

            ...video,

            [e.target.name]:
                e.target.value

        });


    };









    // =========================
    // UPDATE VIDEO
    // =========================


    const handleUpdate = async (e) => {


        e.preventDefault();



        try {


            const response =
                await fetch(

                    `${API}/api/videos/${id}`,

                    {

                        method: "PUT",


                        headers: {


                            "Content-Type":
                                "application/json",


                            Authorization:
                                `Bearer ${token}`


                        },


                        body: JSON.stringify(video)


                    }

                );



            const data =
                await response.json();



            if (response.ok) {


                alert(
                    "Video updated successfully"
                );


                navigate("/dashboard");


            }

            else {


                alert(
                    data.message
                );


            }


        }

        catch (error) {


            console.log(
                "Update Error:",
                error
            );


        }



    };









    return (


        <div

            style={{

                background: "#0f0f0f",

                minHeight: "100vh",

                color: "white"

            }}

        >


            <Navbar />




            <div

                style={{

                    width: "500px",

                    margin: "40px auto",

                    background: "#1c1c1c",

                    padding: "30px",

                    borderRadius: "15px"

                }}

            >



                <h1>

                    ✏ Edit Video

                </h1>




                <form
                    onSubmit={handleUpdate}
                >




                    <label>
                        Title
                    </label>


                    <input

                        name="title"

                        value={video.title}

                        onChange={handleChange}

                        style={inputStyle}

                    />






                    <label>
                        Thumbnail URL
                    </label>


                    <input

                        name="thumbnail"

                        value={video.thumbnail}

                        onChange={handleChange}

                        style={inputStyle}

                    />







                    <label>
                        Video URL
                    </label>


                    <input

                        name="videoUrl"

                        value={video.videoUrl}

                        onChange={handleChange}

                        style={inputStyle}

                    />







                    <button

                        type="submit"

                        style={buttonStyle}

                    >

                        Update Video

                    </button>



                </form>



            </div>



        </div>


    );



};








const inputStyle = {


    width: "100%",


    padding: "12px",


    margin: "10px 0 20px",


    borderRadius: "8px",


    border: "none",


    fontSize: "15px"


};





const buttonStyle = {


    width: "100%",


    padding: "12px",


    borderRadius: "25px",


    border: "none",


    cursor: "pointer",


    fontWeight: "bold",


    background: "#ff0000",


    color: "white"


};






export default EditVideo;