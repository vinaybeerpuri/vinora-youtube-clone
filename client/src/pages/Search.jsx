import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";


const Search = () => {


    const [params] = useSearchParams();

    const query = params.get("q");


    const [videos, setVideos] = useState([]);



    useEffect(() => {


        fetch(
            `http://localhost:5000/api/videos/search?q=${query}`
        )

            .then(res => res.json())

            .then(data => setVideos(data))


    }, [query]);



    return (

        <div
            style={{
                background: "#0f0f0f",
                color: "white",
                minHeight: "100vh",
                padding: "20px"
            }}
        >


            <h2>
                Search Results for "{query}"
            </h2>



            {
                videos.length === 0 ?

                    <p>
                        No videos found
                    </p>


                    :

                    videos.map(video => (

                        <Link

                            key={video._id}

                            to={`/video/${video._id}`}

                            style={{
                                color: "white",
                                textDecoration: "none"
                            }}

                        >


                            <div>

                                <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    width="300"
                                />


                                <h3>
                                    {video.title}
                                </h3>


                            </div>


                        </Link>

                    ))

            }



        </div>


    );


};


export default Search;
