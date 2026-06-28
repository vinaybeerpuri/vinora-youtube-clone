import React from "react";
import { Link } from "react-router-dom";


const VideoCard = ({ video }) => {

  return (

    <Link

      to={`/video/${video._id}`}

      style={{
        textDecoration: "none",
        color: "white"
      }}

    >


      <div

        style={{

          cursor: "pointer",

          transition: "0.3s",

        }}


        onMouseEnter={(e) => {

          e.currentTarget.style.transform =
            "translateY(-5px)";

        }}


        onMouseLeave={(e) => {

          e.currentTarget.style.transform =
            "translateY(0)";

        }}

      >



        {/* THUMBNAIL */}

        <div

          style={{

            position: "relative"

          }}

        >

          <img

            src={
              video.thumbnail &&
                video.thumbnail.startsWith("http")
                ? video.thumbnail
                : "https://via.placeholder.com/400x220?text=No+Thumbnail"
            }

            alt={video.title}

            onError={(e) => {

              e.target.src =
                "https://via.placeholder.com/400x220?text=No+Thumbnail";

            }}

            style={{

              width: "100%",

              height: "200px",

              objectFit: "cover",

              borderRadius: "12px"

            }}

          />


          {/* Duration placeholder */}

          <span

            style={{

              position: "absolute",

              bottom: "10px",

              right: "10px",

              background: "black",

              padding: "3px 6px",

              borderRadius: "4px",

              fontSize: "12px"

            }}

          >

            10:20

          </span>


        </div>





        {/* VIDEO INFO */}

        <div

          style={{

            display: "flex",

            gap: "12px",

            marginTop: "12px"

          }}

        >



          {/* CHANNEL IMAGE */}

          <div

            style={{

              width: "40px",

              height: "40px",

              borderRadius: "50%",

              background: "#333",

              display: "flex",

              justifyContent: "center",

              alignItems: "center",

              flexShrink: 0

            }}

          >

            👤

          </div>





          <div>


            <h3

              style={{

                fontSize: "16px",

                margin: "0",

                fontWeight: "600",

                lineHeight: "22px",

                display: "-webkit-box",

                WebkitLineClamp: 2,

                WebkitBoxOrient: "vertical",

                overflow: "hidden"

              }}

            >

              {video.title}

            </h3>



            <p

              style={{

                color: "#aaa",

                margin: "6px 0 0"

              }}

            >

              {video.channel}

            </p>




            <p

              style={{

                color: "#aaa",

                margin: "4px 0"

              }}

            >

              {video.views} views • 2 days ago

            </p>



          </div>


        </div>


      </div>


    </Link>

  );

};


export default VideoCard;