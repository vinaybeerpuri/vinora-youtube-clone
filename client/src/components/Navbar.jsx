import React, {
  useState
} from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";


const Navbar = () => {


  const token =
    localStorage.getItem("token");


  const user =
    JSON.parse(
      localStorage.getItem("user")
    );


  const [search, setSearch] =
    useState("");


  const [createOpen, setCreateOpen] =
    useState(false);


  const [profileOpen, setProfileOpen] =
    useState(false);



  const navigate =
    useNavigate();





  const handleSearch = (e) => {


    if (
      e.key === "Enter" &&
      search.trim() !== ""
    ) {

      navigate(
        `/search?q=${search}`
      );

    }

  };






  const logout = () => {


    localStorage.removeItem(
      "token"
    );


    localStorage.removeItem(
      "user"
    );


    navigate("/login");


  };






  return (

    <div

      style={{

        height: "65px",

        background: "#202020",

        color: "white",

        display: "flex",

        alignItems: "center",

        justifyContent: "space-between",

        padding: "0 25px",

        position: "sticky",

        top: 0,

        zIndex: 1000

      }}

    >





      {/* LOGO */}


      <Link

        to="/"

        style={{

          textDecoration: "none",

          color: "red"

        }}

      >

        <h2>

          🎬 VINORA

        </h2>


      </Link>






      {/* SEARCH */}


      <input

        type="text"

        placeholder="Search Videos..."

        value={search}

        onChange={(e) =>
          setSearch(e.target.value)
        }

        onKeyDown={handleSearch}


        style={{

          width: "450px",

          padding: "12px 20px",

          borderRadius: "25px",

          border: "none",

          outline: "none",

          fontSize: "15px"

        }}


      />







      {/* RIGHT MENU */}


      <div

        style={{

          display: "flex",

          alignItems: "center",

          gap: "18px"

        }}

      >




        {

          token ?

            (

              <>


                {/* CREATE BUTTON */}


                <div

                  style={{
                    position: "relative"
                  }}

                >


                  <button

                    onClick={() =>
                      setCreateOpen(!createOpen)
                    }


                    style={{

                      padding: "10px 18px",

                      borderRadius: "20px",

                      border: "none",

                      cursor: "pointer",

                      fontWeight: "bold"

                    }}

                  >

                    ➕ Create

                  </button>





                  {
                    createOpen &&

                    (

                      <div

                        style={{

                          position: "absolute",

                          top: "45px",

                          right: 0,

                          background: "white",

                          color: "black",

                          width: "180px",

                          borderRadius: "10px",

                          padding: "10px",

                          boxShadow:
                            "0 5px 15px rgba(0,0,0,.4)"

                        }}

                      >


                        <p

                          onClick={() =>
                            navigate("/upload")
                          }

                          style={{
                            cursor: "pointer"
                          }}

                        >

                          🎥 Upload Video

                        </p>



                        <p

                          onClick={() =>
                            navigate("/live")
                          }

                          style={{
                            cursor: "pointer"
                          }}

                        >

                          🔴 Go Live

                        </p>



                      </div>

                    )

                  }



                </div>






                {/* NOTIFICATION */}


                <div

                  style={{

                    fontSize: "22px",

                    cursor: "pointer"

                  }}

                >

                  🔔

                </div>









                {/* PROFILE ICON */}



                <div

                  style={{

                    position: "relative"

                  }}

                >



                  <img


                    src={
                      user?.profileImage ||
                      "https://i.pravatar.cc/100"
                    }


                    onClick={() =>
                      setProfileOpen(!profileOpen)
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

                    profileOpen &&

                    (

                      <div


                        style={{

                          position: "absolute",

                          right: 0,

                          top: "55px",

                          width: "300px",

                          background: "white",

                          color: "black",

                          borderRadius: "15px",

                          padding: "20px",

                          boxShadow:
                            "0 5px 20px rgba(0,0,0,.5)"

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

                            alt="profile"

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





                        <p
                          onClick={() =>
                            navigate("/dashboard")
                          }
                          style={{
                            cursor: "pointer"
                          }}
                        >
                          👤 View your channel
                        </p>




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





              </>

            )

            :

            (

              <>


                <Link to="/login">

                  <button>
                    Login
                  </button>

                </Link>
                <Link to="/upload">

                  <button
                    style={{
                      padding: "8px 15px",
                      cursor: "pointer",
                      fontWeight: "bold"
                    }}
                  >

                    ➕ Create

                  </button>

                </Link>




                <Link to="/register">

                  <button>
                    Register
                  </button>

                </Link>



              </>

            )


        }



      </div>




    </div>

  );

};


export default Navbar;