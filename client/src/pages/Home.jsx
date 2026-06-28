import React, { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import VideoCard from "../components/VideoCard";
import API from "../config/api";


const Home = () => {


  const [videos, setVideos] = useState([]);



  useEffect(() => {


    const fetchVideos = async () => {

      try {

        const API = process.env.REACT_APP_API_URL;

        const response =
          await fetch(
            `${API}/api/videos`
          );


        const data =
          await response.json();


        console.log("API RESPONSE:", data);


        setVideos(
          Array.isArray(data)
            ? data
            : []
        );


      } catch (error) {

        console.log(
          "Video Fetch Error:",
          error
        );

      }

    };


    fetchVideos();


  }, []);



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
          display: "flex"
        }}
      >


        <Sidebar />



        <main
          style={{
            flex: 1,
            padding: "25px",
            marginLeft: "260px"
          }}
        >


          <h1

            style={{

              fontSize: "28px",

              marginBottom: "25px"

            }}

          >

            Recommended Videos

          </h1>




          {
            videos.length === 0 ?

              (

                <h3>
                  No videos available
                </h3>

              )

              :

              (

                <div

                  style={{

                    display: "grid",

                    gridTemplateColumns:
                      "repeat(auto-fill,minmax(300px,1fr))",

                    gap: "25px"

                  }}

                >


                  {
                    videos.map(video => (


                      <VideoCard

                        key={video._id}

                        video={video}

                      />


                    ))
                  }


                </div>

              )

          }



        </main>



      </div>


    </div>

  );


};


export default Home;