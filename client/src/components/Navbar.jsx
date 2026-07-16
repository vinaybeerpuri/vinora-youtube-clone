import React, {
  useState
} from "react";

import {
  Link,
  useNavigate
} from "react-router-dom";

import "./Navbar.css";

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

    <div className="vinora-navbar">





      {/* LOGO */}


      <Link

        to="/"
        className="vinora-navbar__logo"

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
        className="vinora-navbar__search"


      />







      {/* RIGHT MENU */}


      <div className="vinora-navbar__right">




        {

          token ?

            (

              <>


                {/* CREATE BUTTON */}


                <div className="vinora-navbar__create-wrap">


                  <button

                    onClick={() =>
                      setCreateOpen(!createOpen)
                    }
                    className="vinora-navbar__create-btn"

                  >

                    ➕ Create

                  </button>





                  {
                    createOpen &&

                    (

                      <div className="vinora-navbar__create-menu">


                        <p

                          onClick={() =>
                            navigate("/upload")
                          }

                        >

                          🎥 Upload Video

                        </p>



                        <p

                          onClick={() =>
                            navigate("/live")
                          }

                        >

                          🔴 Go Live

                        </p>



                      </div>

                    )

                  }



                </div>






                {/* NOTIFICATION */}


                <div className="vinora-navbar__notif">

                  🔔

                </div>









                {/* PROFILE ICON */}



                <div className="vinora-navbar__profile-wrap">



                  <img


                    src={
                      user?.profileImage ||
                      "https://i.pravatar.cc/100"
                    }


                    onClick={() =>
                      setProfileOpen(!profileOpen)
                    }


                    alt="profile"
                    className="vinora-navbar__avatar"


                  />







                  {

                    profileOpen &&

                    (

                      <div className="vinora-navbar__profile-menu">





                        <div className="vinora-navbar__profile-header">


                          <img

                            src={
                              user?.profileImage ||
                              "https://i.pravatar.cc/100"
                            }

                            alt="profile"

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
                        >
                          👤 View your channel
                        </p>

                        <p
                          onClick={() =>
                            navigate("/call")
                          }
                        >
                          📞 Video Call
                        </p>




                        <p>

                          🔵 Google Account

                        </p>




                        <p>

                          🔄 Switch account

                        </p>





                        <p

                          onClick={logout}

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

                  <button className="vinora-navbar__auth-btn">
                    Login
                  </button>

                </Link>
                <Link to="/upload">

                  <button className="vinora-navbar__auth-btn">

                    ➕ Create

                  </button>

                </Link>




                <Link to="/register">

                  <button className="vinora-navbar__auth-btn">
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