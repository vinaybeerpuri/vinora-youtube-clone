import React, {
  useEffect,
  useState
} from "react";

import Navbar from "../components/Navbar";


const Downloads = () => {


  const [downloads, setDownloads] =
    useState([]);



  useEffect(() => {

    fetchDownloads();

  }, []);



  const fetchDownloads = async () => {


    const token =
      localStorage.getItem("token");



    if (!token) {

      alert(
        "Please login first"
      );

      return;

    }



    try {


      const response =
        await fetch(
          "http://localhost:5000/api/download",
          {

            method: "GET",

            headers: {

              Authorization:
                `Bearer ${token}`

            }

          }
        );



      const data =
        await response.json();



      console.log(
        "MY DOWNLOADS:",
        data
      );



      if (response.ok) {

        setDownloads(data);

      }

      else {

        alert(
          data.message
        );

      }


    }

    catch (error) {

      console.log(
        "Download Fetch Error:",
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
          My Downloads
        </h1>



        {
          downloads.length === 0

            ?

            (

              <p>
                No downloads yet.
              </p>

            )


            :


            downloads.map(
              (video) => (


                <div

                  key={
                    video._id
                  }


                  style={{

                    background: "#1c1c1c",

                    padding: "20px",

                    marginTop: "20px",

                    borderRadius: "10px"

                  }}

                >


                  <h2>

                    {
                      video.title
                    }

                  </h2>



                  <p>

                    Downloaded on:

                    {" "}

                    {
                      new Date(
                        video.createdAt
                      )
                        .toLocaleDateString()
                    }

                  </p>



                  <a

                    href={
                      video.videoUrl
                    }

                    target="_blank"

                    rel="noreferrer"

                    style={{

                      color: "#3ea6ff"

                    }}

                  >

                    Open Video

                  </a>



                </div>


              )

            )

        }



      </div>


    </div>


  );

};



export default Downloads;