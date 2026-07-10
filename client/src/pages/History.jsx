import React, {
    useEffect,
    useState
} from "react";

import {
    Link
} from "react-router-dom";

import Navbar from "../components/Navbar";
import API from "../config/api";


const History = () => {


    const [history, setHistory] =
        useState([]);



    useEffect(() => {


        const fetchHistory = async () => {


            const token =
                localStorage.getItem("token");


            if (!token)
                return;



            try {


                const response =
                    await fetch(
                        `${API}/api/history`,
                        {

                            headers: {

                                Authorization:
                                    `Bearer ${token}`

                            }

                        }
                    );



                const data =
                    await response.json();



                setHistory(data);



            }

            catch (error) {

                console.log(
                    "History Fetch Error:",
                    error
                );

            }


        };



        fetchHistory();


    }, []);





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
                    Watch History
                </h1>



                {
                    history.length === 0

                        ?

                        (
                            <p
                                style={{
                                    color: "#aaa"
                                }}
                            >
                                No videos watched yet.
                            </p>
                        )


                        :

                        (

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(auto-fill,minmax(300px,1fr))",
                                    gap: "20px"
                                }}
                            >



                                {
                                    history.map((item) => (


                                        <Link

                                            key={item._id}

                                            to={`/video/${item.videoId}`}

                                            style={{
                                                textDecoration: "none",
                                                color: "white"
                                            }}

                                        >


                                            <div
                                                style={{
                                                    background: "#1c1c1c",
                                                    borderRadius: "10px",
                                                    overflow: "hidden"
                                                }}
                                            >



                                                <img

                                                    src={
                                                        item.thumbnail
                                                    }

                                                    alt={
                                                        item.title
                                                    }

                                                    style={{
                                                        width: "100%",
                                                        height: "180px",
                                                        objectFit: "cover"
                                                    }}

                                                />



                                                <div
                                                    style={{
                                                        padding: "15px"
                                                    }}
                                                >


                                                    <h3>
                                                        {item.title}
                                                    </h3>



                                                    <p
                                                        style={{
                                                            color: "#aaa",
                                                            fontSize: "14px"
                                                        }}
                                                    >

                                                        Watched on:

                                                        {" "}

                                                        {
                                                            new Date(
                                                                item.createdAt
                                                            )
                                                                .toLocaleDateString()
                                                        }

                                                    </p>



                                                </div>



                                            </div>


                                        </Link>


                                    ))
                                }



                            </div>

                        )

                }



            </div>


        </div>

    );


};


export default History;