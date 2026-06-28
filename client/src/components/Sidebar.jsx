import React from "react";
import { Link } from "react-router-dom";


const Sidebar = () => {


    const menuStyle = {

        display: "flex",

        alignItems: "center",

        gap: "15px",

        padding: "12px",

        borderRadius: "10px",

        cursor: "pointer",

        color: "white",

        textDecoration: "none",

        marginBottom: "8px"

    };



    return (


        <div

            style={{

                width: "220px",

                backgroundColor: "#181818",

                color: "white",

                minHeight: "calc(100vh - 60px)",

                padding: "20px",

                position: "fixed",

                top: "60px",

                left: 0

            }}

        >



            {/* MAIN */}

            <h4

                style={{

                    color: "#aaa"

                }}

            >

                Main

            </h4>



            <Link

                to="/"

                style={menuStyle}

            >

                🏠 Home

            </Link>



            <Link

                to="/search"

                style={menuStyle}

            >

                🔥 Trending

            </Link>



            <Link

                to="/subscriptions"

                style={menuStyle}

            >

                📺 Subscriptions

            </Link>





            <hr

                style={{

                    borderColor: "#333"

                }}

            />





            {/* LIBRARY */}


            <h4

                style={{

                    color: "#aaa"

                }}

            >

                Library

            </h4>




            <Link

                to="/history"

                style={menuStyle}

            >

                🕒 History

            </Link>




            <Link

                to="/downloads"

                style={menuStyle}

            >

                ⬇ Downloads

            </Link>




            <Link

                to="/profile"

                style={menuStyle}

            >

                👤 Profile

            </Link>





            <hr

                style={{

                    borderColor: "#333"

                }}

            />





            {/* PREMIUM */}


            <Link

                to="/premium"

                style={{

                    ...menuStyle,

                    background: "gold",

                    color: "black",

                    fontWeight: "bold"

                }}

            >

                ⭐ Premium

            </Link>




        </div>

    );

};


export default Sidebar;