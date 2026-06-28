import React, {
  useEffect,
  useState
} from "react";

import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";


const Profile = () => {


  const [user, setUser] =
    useState(null);



  useEffect(() => {

    getProfile();

  }, []);




  const getProfile = async () => {


    const token =
      localStorage.getItem("token");



    if (!token) {

      window.location.href =
        "/login";

      return;

    }



    try {


      const response =
        await fetch(
          "http://localhost:5000/api/profile",
          {

            headers: {

              Authorization:
                `Bearer ${token}`

            }

          }
        );



      const data =
        await response.json();



      console.log(
        "PROFILE DATA:",
        data
      );



      if (response.ok) {

        setUser(data);


        // update local storage also

        localStorage.setItem(
          "user",
          JSON.stringify(data)
        );

      }



    }

    catch (error) {

      console.log(
        error
      );

    }


  };




  if (!user) {

    return (

      <div
        style={{
          background: "#0f0f0f",
          color: "white",
          minHeight: "100vh",
          padding: "30px"
        }}
      >

        Loading Profile...

      </div>

    );

  }




  const watchPercentage =
    user.watchLimit > 0
      ?
      Math.min(
        (user.watchTimeUsed /
          user.watchLimit) * 100,
        100
      )
      :
      0;




  return (

    <div

      style={{

        backgroundColor: "#0f0f0f",

        color: "white",

        minHeight: "100vh"

      }}

    >


      <Navbar />



      <div

        style={{

          maxWidth: "900px",

          margin: "auto",

          padding: "30px"

        }}

      >



        {/* COVER */}

        <div

          style={{

            height: "200px",

            background:
              "linear-gradient(90deg,#3a3a3a,#202020)",

            borderRadius: "12px"

          }}

        />





        {/* HEADER */}

        <div

          style={{

            display: "flex",

            alignItems: "center",

            gap: "20px",

            marginTop: "-50px"

          }}

        >


          <img

            src="https://i.pravatar.cc/150"

            alt="profile"

            style={{

              width: "120px",

              height: "120px",

              borderRadius: "50%",

              border:
                "4px solid #0f0f0f"

            }}

          />



          <div>

            <h1>

              {user.name}

            </h1>


            <p
              style={{
                color: "#aaa"
              }}
            >

              {user.email}

            </p>


          </div>


        </div>





        {/* ACCOUNT DETAILS */}


        <div

          style={{

            background: "#1c1c1c",

            padding: "20px",

            borderRadius: "12px",

            marginTop: "30px"

          }}

        >


          <h2>
            Account Details
          </h2>


          <p>
            <b>Name:</b> {user.name}
          </p>


          <p>
            <b>Email:</b> {user.email}
          </p>


          <p>
            <b>Mobile:</b> {user.mobile || "Not Added"}
          </p>


          <p>
            <b>State:</b> {user.state || "Not Added"}
          </p>


        </div>







        {/* PREMIUM STATUS */}


        <div

          style={{

            background: "#1c1c1c",

            padding: "20px",

            borderRadius: "12px",

            marginTop: "20px"

          }}

        >


          <h2>
            Subscription
          </h2>


          <p>

            <b>Status:</b>

            {" "}

            {
              user.isPremium
                ?
                "Premium ✅"
                :
                "Free User"
            }

          </p>



          <p>

            <b>Plan:</b>

            {" "}

            {user.plan}


          </p>




          {
            user.subscriptionExpiry &&

            <p>

              <b>Expiry:</b>

              {" "}

              {
                new Date(
                  user.subscriptionExpiry
                )
                  .toLocaleDateString()
              }

            </p>

          }



          {
            !user.isPremium &&

            <Link to="/premium">

              <button

                style={{

                  background: "gold",

                  padding: "10px 20px",

                  cursor: "pointer"

                }}

              >

                Upgrade Premium

              </button>

            </Link>

          }


        </div>







        {/* WATCH TIME */}



        <div

          style={{

            background: "#1c1c1c",

            padding: "20px",

            marginTop: "20px",

            borderRadius: "12px"

          }}

        >

          <h2>
            Watch Time
          </h2>


          {
            user.plan === "Gold"

              ?

              <p>
                Unlimited Watch Time ♾️
              </p>


              :

              <>

                <p>

                  {user.watchTimeUsed}

                  /

                  {user.watchLimit}

                  minutes used

                </p>



                <div

                  style={{

                    background: "#444",

                    height: "15px",

                    borderRadius: "10px"

                  }}

                >

                  <div

                    style={{

                      width:
                        `${watchPercentage}%`,

                      height: "100%",

                      background: "red",

                      borderRadius: "10px"

                    }}

                  />


                </div>

              </>

          }


        </div>







        {/* DOWNLOAD STATUS */}


        <div

          style={{

            background: "#1c1c1c",

            padding: "20px",

            marginTop: "20px",

            borderRadius: "12px"

          }}

        >


          <h2>
            Downloads
          </h2>


          {

            user.isPremium

              ?

              <p>
                Unlimited Downloads ✅
              </p>


              :

              <p>

                Remaining:

                {" "}

                {user.downloadsRemaining}

              </p>

          }


        </div>



      </div>


    </div>


  );

};



export default Profile;