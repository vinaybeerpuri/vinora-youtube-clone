import React, {
  useEffect,
  useState,
  useRef
} from "react";

import {
  useParams,
  Link
} from "react-router-dom";

import Comments from "./Comments";


const VideoPlayer = () => {


  const { id } = useParams();


  const [video, setVideo] = useState(null);

  const [recommended, setRecommended] = useState([]);

  const [likes, setLikes] = useState(0);

  const [player, setPlayer] = useState(null);

  const [gestureMessage, setGestureMessage] = useState("");



  const tapCount = useRef(0);

  const tapTimer = useRef(null);
  const touchPosition =
    useRef("");


  // =========================
  // LOAD VIDEO
  // =========================

  useEffect(() => {


    const loadData = async () => {


      try {


        const videoRes =
          await fetch(
            `http://192.168.245.41:5000/api/videos/${id}`
          );


        const videoData =
          await videoRes.json();


        setVideo(videoData);


        setLikes(
          videoData.likes || 0
        );



        const allRes =
          await fetch(
            "http://192.168.245.41:5000/api/videos"
          );


        const allData =
          await allRes.json();



        setRecommended(
          Array.isArray(allData)
            ? allData
            : []
        );



        // ADD HISTORY

        const token =
          localStorage.getItem("token");


        if (token) {

          await fetch(
            "http://192.168.245.41:5000/api/history",
            {

              method: "POST",

              headers: {

                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`

              },


              body: JSON.stringify({

                videoId: id

              })

            });

        }



      }
      catch (error) {

        console.log(error);

      }


    };



    loadData();


  }, [id]);






  // =========================
  // HISTORY
  // =========================


  const addHistory = async () => {


    const token =
      localStorage.getItem("token");


    if (!token)
      return;



    await fetch(
      "http://192.168.245.41:5000/api/history",
      {

        method: "POST",

        headers: {

          "Content-Type":
            "application/json",

          Authorization:
            `Bearer ${token}`

        },


        body: JSON.stringify({

          videoId: id

        })

      }
    );


  };







  // =========================
  // YOUTUBE ID
  // =========================


  const getYoutubeId = (url) => {


    if (!url)
      return "";


    if (url.includes("v=")) {

      return url
        .split("v=")[1]
        .split("&")[0];

    }


    if (url.includes("youtu.be")) {

      return url
        .split("youtu.be/")[1]
        .split("?")[0];

    }


    return "";

  };



  const youtubeId =
    getYoutubeId(
      video?.videoUrl
    );







  // =========================
  // YOUTUBE PLAYER
  // =========================


  useEffect(() => {


    if (!youtubeId)
      return;



    const createPlayer = () => {


      const yt =
        new window.YT.Player(
          "youtube-player",
          {

            height: "500",

            width: "100%",


            videoId: youtubeId,


            playerVars: {

              autoplay: 0

            },


            events: {

              onReady: (event) => {

                setPlayer(
                  event.target
                );

              }

            }

          }
        );



      return yt;


    };





    if (window.YT) {


      createPlayer();


    }
    else {


      const script =
        document.createElement("script");


      script.src =
        "https://www.youtube.com/iframe_api";


      document.body.appendChild(script);



      window.onYouTubeIframeAPIReady =
        createPlayer;


    }



    return () => {

      setPlayer(null);

    };



  }, [youtubeId]);






  // =========================
  // WATCH LIMIT
  // =========================


  useEffect(() => {


    const token =
      localStorage.getItem("token");



    if (!token || !player)
      return;




    const interval =
      setInterval(async () => {


        try {


          const res =
            await fetch(
              "http://192.168.245.41:5000/api/watch",
              {

                method: "PUT",

                headers: {

                  Authorization:
                    `Bearer ${token}`

                }

              });



          const data =
            await res.json();



          if (res.status === 403) {


            alert(data.message);


            player.pauseVideo();


            window.location.href =
              "/premium";


          }


        }
        catch (error) {

          console.log(error);

        }



      }, 60000);




    return () => clearInterval(interval);



  }, [player]);








  // =========================
  // LIKE VIDEO
  // =========================


  const likeVideo = async () => {


    try {


      const res =
        await fetch(
          `http://192.168.245.41:5000/api/videos/${id}/like`,
          {

            method: "PUT"

          });



      const data =
        await res.json();



      setLikes(
        data.likes || 0
      );


    }
    catch (error) {

      console.log(error);

    }


  };







  // =========================
  // DOWNLOAD VIDEO
  // =========================


  const downloadVideo = async () => {


    const token =
      localStorage.getItem("token");


    if (!token) {

      alert("Login required");

      return;

    }



    try {


      const res =
        await fetch(
          "http://192.168.245.41:5000/api/download",
          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`

            },


            body: JSON.stringify({

              videoId: id

            })

          });



      const data =
        await res.json();



      alert(
        data.message
      );


    }
    catch (error) {

      console.log(error);

    }


  };






  // =========================
  // SHARE
  // =========================


  const shareVideo = () => {


    navigator.clipboard.writeText(
      window.location.href
    );


    alert(
      "Link copied"
    );


  };








  // =========================
  // GESTURES
  // =========================


  const showGestureMessage = (msg) => {


    setGestureMessage(msg);


    setTimeout(() => {

      setGestureMessage("");

    }, 1500);


  };






  const handleGesture = (e) => {


    if (!player)
      return;



    const rect =
      e.currentTarget.getBoundingClientRect();



    const x =
      e.clientX - rect.left;



    let position;



    if (x < rect.width / 3) {

      position = "left";

    }
    else if (x > (rect.width * 2) / 3) {

      position = "right";

    }
    else {

      position = "center";

    }



    tapCount.current++;



    clearTimeout(
      tapTimer.current
    );



    tapTimer.current =
      setTimeout(() => {


        const taps =
          tapCount.current;


        tapCount.current = 0;



        // SINGLE TAP

        if (taps === 1 && position === "center") {


          const state =
            player.getPlayerState();



          if (state === 1) {


            player.pauseVideo();

            showGestureMessage(
              "⏸ Paused"
            );


          }
          else {


            player.playVideo();

            showGestureMessage(
              "▶ Playing"
            );


          }


        }






        // DOUBLE TAP

        if (taps === 2) {


          const current =
            player.getCurrentTime();



          if (position === "right") {


            player.seekTo(
              current + 10,
              true
            );


            showGestureMessage(
              "⏩ +10 sec"
            );


          }



          if (position === "left") {


            player.seekTo(
              current - 10,
              true
            );


            showGestureMessage(
              "⏪ -10 sec"
            );


          }


        }







        // TRIPLE TAP

        if (taps === 3) {



          if (position === "left") {


            document
              .getElementById(
                "comments"
              )
              ?.scrollIntoView({
                behavior: "smooth"
              });



            showGestureMessage(
              "💬 Comments"
            );


          }





          if (position === "right") {


            window.location.href = "/";


          }


        }



      }, 300);


  };
  // =========================
  // MOBILE TOUCH GESTURE
  // =========================

  const handleTouchStart = (e) => {


    if (!player)
      return;



    const touch =
      e.touches[0];


    const rect =
      e.currentTarget.getBoundingClientRect();



    const x =
      touch.clientX - rect.left;



    if (x < rect.width / 3) {

      touchPosition.current =
        "left";

    }

    else if (x > (rect.width * 2) / 3) {

      touchPosition.current =
        "right";

    }

    else {

      touchPosition.current =
        "center";

    }



    tapCount.current++;



    clearTimeout(
      tapTimer.current
    );



    tapTimer.current =
      setTimeout(() => {


        const taps =
          tapCount.current;


        tapCount.current = 0;



        const position =
          touchPosition.current;




        // SINGLE TAP

        if (taps === 1 && position === "center") {


          const state =
            player.getPlayerState();



          if (state === 1) {

            player.pauseVideo();

            showGestureMessage(
              "⏸ Paused"
            );

          }
          else {

            player.playVideo();

            showGestureMessage(
              "▶ Playing"
            );

          }


        }




        // DOUBLE TAP

        if (taps === 2) {


          const current =
            player.getCurrentTime();



          if (position === "right") {


            player.seekTo(
              current + 10,
              true
            );


            showGestureMessage(
              "⏩ +10 seconds"
            );


          }



          if (position === "left") {


            player.seekTo(
              current - 10,
              true
            );


            showGestureMessage(
              "⏪ -10 seconds"
            );


          }


        }





        // TRIPLE TAP

        if (taps === 3) {



          if (position === "left") {


            document
              .getElementById("comments")
              ?.scrollIntoView({
                behavior: "smooth"
              });



            showGestureMessage(
              "💬 Comments"
            );


          }




          if (position === "right") {


            window.location.href = "/";


          }


        }



      }, 300);



  };







  if (!video) {


    return (

      <div
        style={{
          background: "#111",
          color: "white",
          height: "100vh",
          padding: "30px"
        }}
      >

        Loading...

      </div>

    );


  }








  return (


    <div

      style={{

        background: "#0f0f0f",

        color: "white",

        minHeight: "100vh",

        padding: "20px"

      }}

    >



      <div

        style={{

          display: "flex",

          gap: "25px"

        }}

      >




        {/* MAIN CONTENT */}


        <div

          style={{

            flex: 3

          }}

        >




          <div

            style={{

              position: "relative"

            }}

          >


            <div

              id="youtube-player"

              onClick={handleGesture}

              onTouchStart={handleTouchStart}

              style={{

                touchAction: "manipulation"

              }}

            >
            </div>



            {
              gestureMessage &&

              <div

                style={{

                  position: "absolute",

                  top: "50%",

                  left: "50%",

                  transform:
                    "translate(-50%,-50%)",

                  background:
                    "rgba(0,0,0,.7)",

                  padding: "15px 25px",

                  borderRadius: "10px",

                  fontSize: "20px"

                }}

              >

                {gestureMessage}

              </div>

            }


          </div>







          <h2>

            {video.title}

          </h2>




          <button onClick={likeVideo}>

            👍 {likes}

          </button>




          <button

            onClick={downloadVideo}

            style={{

              marginLeft: "10px"

            }}

          >

            ⬇ Download

          </button>





          <button

            onClick={shareVideo}

            style={{

              marginLeft: "10px"

            }}

          >

            Share

          </button>







          <div

            style={{

              marginTop: "20px",

              background: "#222",

              padding: "20px",

              borderRadius: "12px"

            }}

          >


            <h3>

              {video.channel}

            </h3>


            <p>

              {video.views} views

            </p>


            <p>

              Welcome to VINORA.
              Enjoy watching this video.

            </p>


          </div>







          <div id="comments">


            <Comments

              videoId={id}

            />


          </div>





        </div>









        {/* RECOMMENDED */}


        <div

          style={{

            flex: 1

          }}

        >


          <h3>

            Recommended

          </h3>



          {
            recommended

              .filter(
                v => v._id !== video._id
              )

              .map(v => (


                <Link

                  key={v._id}

                  to={`/video/${v._id}`}

                  style={{

                    color: "white",

                    textDecoration: "none"

                  }}

                >


                  <img

                    src={v.thumbnail}

                    alt={v.title}

                    style={{

                      width: "100%",

                      borderRadius: "10px"

                    }}

                  />


                  <h4>

                    {v.title}

                  </h4>


                </Link>


              ))

          }



        </div>



      </div>


    </div>


  );


};


export default VideoPlayer;