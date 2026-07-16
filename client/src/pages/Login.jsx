import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../config/api";

const Login = () => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            const response = await fetch(
                `${API}/api/auth/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );


            const data =
                await response.json();


            console.log(
                "LOGIN RESPONSE:",
                data
            );


            if (response.ok) {
                if (data.pendingOtp) {
                    localStorage.setItem("pendingUserId", data.userId);
                    localStorage.setItem("pendingChannel", data.otpChannel);
                    alert("OTP sent to your registered " + (data.otpChannel === "email" ? "Email" : "Mobile"));
                    window.location.href = "/verify-otp";
                } else {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("user", JSON.stringify(data));
                    alert("Login Successful");
                    window.location.href = "/";
                }
            }
            else {

                alert(data.message);

            }


        }
        catch (error) {

            console.log(error);

            alert("Server Error");

        }

    };



    return (

        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
                background: "#0f0f0f",
                color: "white"
            }}
        >


            <form
                onSubmit={handleLogin}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "15px",
                    width: "350px",
                    background: "#1c1c1c",
                    padding: "30px",
                    borderRadius: "10px"
                }}
            >


                <h1 style={{ color: "red" }}>
                    VINORA
                </h1>


                <h2>
                    Login
                </h2>


                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />


                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />


                <button>
                    Login
                </button>


                <p>
                    Don't have account?

                    <Link to="/register">
                        Register
                    </Link>

                </p>


            </form>


        </div>

    );

};


export default Login;