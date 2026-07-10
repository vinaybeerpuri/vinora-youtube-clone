import React, {
    useEffect,
    useState
} from "react";
import API from "../config/api";

import Navbar from "../components/Navbar";
import {
    Link,
    useNavigate
} from "react-router-dom";


const Dashboard = () => {


    const [user, setUser] =
        useState(null);


    const [history, setHistory] =
        useState([]);


    const [videos, setVideos] =
        useState([]);


    const navigate =
        useNavigate();





    const token =
        localStorage.getItem("token");





    useEffect(() => {


        if (!token) {

            navigate("/login");
            return;

        }




        // PROFILE

        fetch(
            `${API}/api/profile`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        )

            .then(res => res.json())

            .then(data => {

                console.log("PROFILE RESPONSE:", data);

                setUser(data);

            })

            .catch(err => {
                console.log(err);
            });







        // HISTORY

        fetch(
            `${API}/api/history`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        )

            .then(res => res.json())

            .then(data => {

                setHistory(
                    Array.isArray(data)
                        ?
                        data
                        :
                        []
                );

            });









        // MY VIDEOS


        fetch(
            `${API}/api/videos/myvideos`,
            {

                headers: {
                    Authorization:
                        `Bearer ${token}`
                }

            }
        )


            .then(res => res.json())


            .then(data => {


                setVideos(

                    Array.isArray(data)
                        ?
                        data
                        :
                        []

                );


            });



    }, [navigate, token]);












    // DELETE VIDEO

    const deleteVideo = async (id) => {


        const confirm =
            window.confirm(
                "Delete this video?"
            );


        if (!confirm)
            return;



        try {


            const response =
                await fetch(

                    `${API}/api/videos/${id}`,

                    {

                        method: "DELETE",

                        headers: {

                            Authorization:
                                `Bearer ${token}`

                        }

                    }

                );



            const data =
                await response.json();





            if (response.ok) {


                alert(
                    "Video deleted successfully"
                );


                setVideos(

                    videos.filter(

                        video =>
                            video._id !== id

                    )

                );


            }
            else {

                alert(
                    data.message
                );

            }



        }

        catch (error) {

            console.log(
                "Delete Error:",
                error
            );

        }


    };









    return (

        <div

            style={{

                background: "#0f0f0f",

                color: "white",

                minHeight: "100vh"

            }}

        >


            <Navbar />



            <div

                style={{

                    padding: "30px"

                }}

            >



                <h1>
                    VINORA Studio Dashboard
                </h1>







                {/* PROFILE */}

                {

                    user &&

                    <div

                        style={cardStyle}

                    >


                        <h2>
                            Profile
                        </h2>


                        <p>
                            <b>Name:</b> {user.name}
                        </p>


                        <p>
                            <b>Email:</b> {user.email}
                        </p>


                        <p>
                            <b>Plan:</b> {user.plan}
                        </p>


                        <p>
                            <b>Subscribers:</b> {user.subscribers || 0}
                        </p>


                    </div>

                }








                {/* ACTION BUTTONS */}


                <div

                    style={{

                        marginTop: "25px",

                        display: "flex",

                        gap: "15px"

                    }}

                >


                    <button

                        style={buttonStyle}

                        onClick={() =>
                            navigate("/upload")
                        }

                    >

                        ➕ Upload Video

                    </button>



                    <button

                        style={buttonStyle}

                        onClick={() =>
                            navigate("/live")
                        }

                    >

                        🔴 Go Live

                    </button>


                </div>









                {/* ANALYTICS */}


                <h2 style={{ marginTop: "40px" }}>
                    Channel Analytics
                </h2>


                <div

                    style={{

                        display: "grid",

                        gridTemplateColumns:
                            "repeat(auto-fit,minmax(200px,1fr))",

                        gap: "20px"

                    }}

                >


                    <AnalyticsCard

                        title="Videos"

                        value={videos.length}

                    />


                    <AnalyticsCard

                        title="Views"

                        value={

                            videos.reduce(

                                (total, v) =>

                                    total + (Number(v.views) || 0),

                                0

                            )

                        }

                    />



                    <AnalyticsCard

                        title="Likes"

                        value={

                            videos.reduce(

                                (total, v) =>

                                    total + (v.likes || 0),

                                0

                            )

                        }

                    />



                    <AnalyticsCard

                        title="Subscribers"

                        value={
                            user?.subscribers || 0
                        }

                    />


                </div>









                {/* MY VIDEOS */}


                <h2 style={{ marginTop: "40px" }}>
                    Your Videos
                </h2>



                {

                    videos.length === 0

                        ?

                        <p>
                            No uploaded videos
                        </p>


                        :

                        videos.map(video => (


                            <div

                                key={video._id}

                                style={{

                                    ...cardStyle,

                                    display: "flex",

                                    gap: "20px"

                                }}

                            >



                                <img

                                    src={video.thumbnail}

                                    alt={video.title}

                                    width="180"

                                    style={{
                                        borderRadius: "10px"
                                    }}

                                />



                                <div>


                                    <h3>
                                        {video.title}
                                    </h3>


                                    <p>
                                        {video.views} views
                                    </p>


                                    <p>
                                        👍 {video.likes}
                                    </p>





                                    <div

                                        style={{

                                            display: "flex",

                                            gap: "10px"

                                        }}

                                    >


                                        <button

                                            style={buttonStyle}

                                            onClick={() =>

                                                navigate(
                                                    `/edit-video/${video._id}`
                                                )

                                            }

                                        >

                                            ✏ Edit

                                        </button>





                                        <button

                                            style={{

                                                ...buttonStyle,

                                                background: "red",

                                                color: "white"

                                            }}

                                            onClick={() =>
                                                deleteVideo(video._id)
                                            }

                                        >

                                            🗑 Delete

                                        </button>



                                    </div>



                                </div>


                            </div>


                        ))


                }









                {/* HISTORY */}



                <h2 style={{ marginTop: "40px" }}>
                    Recently Watched
                </h2>



                {

                    history.length === 0

                        ?

                        <p>
                            No watch history
                        </p>


                        :

                        history.map(video => (


                            <Link

                                key={video._id}

                                to={`/video/${video.videoId}`}

                                style={{

                                    color: "white",

                                    textDecoration: "none"

                                }}

                            >


                                <div

                                    style={{

                                        display: "flex",

                                        gap: "20px",

                                        marginBottom: "15px"

                                    }}

                                >


                                    <img

                                        src={video.thumbnail}

                                        width="160"

                                        alt={video.title}

                                    />


                                    <h3>
                                        {video.title}
                                    </h3>


                                </div>


                            </Link>


                        ))


                }



            </div>


        </div>


    );

};









const AnalyticsCard = ({
    title,
    value
}) => {


    return (

        <div

            style={cardStyle}

        >

            <h3>
                {title}
            </h3>

            <h1>
                {value}
            </h1>


        </div>

    );


};









const cardStyle = {

    background: "#1c1c1c",

    padding: "20px",

    borderRadius: "15px",

    marginTop: "20px"

};





const buttonStyle = {

    padding: "10px 20px",

    borderRadius: "20px",

    border: "none",

    cursor: "pointer",

    fontWeight: "bold"

};





export default Dashboard;