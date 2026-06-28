import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";


const ProfileMenu = () => {

    const [open, setOpen] = useState(false);

    const navigate = useNavigate();


    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");

    };


    const user =
        JSON.parse(
            localStorage.getItem("user")
        );


    return (

        <div
            style={{
                position: "relative"
            }}
        >


            {/* PROFILE ICON */}

            <img

                onClick={() =>
                    setOpen(!open)
                }

                src={
                    user?.profileImage ||
                    "https://i.pravatar.cc/100"
                }

                alt="profile"

                style={{

                    width: "42px",
                    height: "42px",
                    borderRadius: "50%",
                    cursor: "pointer"

                }}

            />





            {
                open && (

                    <div

                        style={{

                            position: "absolute",
                            right: 0,
                            top: "50px",

                            width: "320px",

                            background: "#fff",

                            color: "black",

                            borderRadius: "15px",

                            padding: "20px",

                            boxShadow:
                                "0 5px 20px rgba(0,0,0,.3)",

                            zIndex: 1000

                        }}

                    >


                        <div
                            style={{
                                display: "flex",
                                gap: "15px",
                                alignItems: "center"
                            }}
                        >

                            <img

                                src={
                                    user?.profileImage ||
                                    "https://i.pravatar.cc/100"
                                }

                                style={{
                                    width: "60px",
                                    height: "60px",
                                    borderRadius: "50%"
                                }}

                            />


                            <div>

                                <h3>
                                    {user?.name || "Vinay"}
                                </h3>

                                <p>
                                    @{user?.username || "vinay"}
                                </p>

                            </div>


                        </div>




                        <hr />




                        <Link
                            to="/channel"
                            style={{
                                textDecoration: "none",
                                color: "black"
                            }}
                        >

                            <p>
                                👤 View your channel
                            </p>

                        </Link>





                        <p>
                            🔵 Google Account
                        </p>


                        <p>
                            🔄 Switch account
                        </p>



                        <p
                            onClick={logout}
                            style={{
                                cursor: "pointer"
                            }}
                        >
                            🚪 Sign out
                        </p>



                        <hr />


                        <p>
                            ⚙ Settings
                        </p>


                        <p>
                            🌙 Appearance
                        </p>


                    </div>

                )
            }



        </div>

    )

}


export default ProfileMenu;