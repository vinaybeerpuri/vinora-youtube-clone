import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../config/api";
import logo from "../assets/vinora-logo.png";

const Register = () => {
    const [name, setName] =
        useState("");

    const [email, setEmail] =
        useState("");

    const [mobile, setMobile] =
        useState("");

    const [state, setState] =
        useState("");

    const [password, setPassword] =
        useState("");

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                `${API}/api/auth/register`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        mobile,
                        state,
                        password,
                    }),
                }
            );

            const data =
                await response.json();

            if (response.ok) {
                if (data.pendingOtp) {
                    localStorage.setItem("pendingUserId", data.userId);
                    localStorage.setItem("pendingChannel", data.otpChannel);
                    alert("Registration successful. OTP sent to your registered " + (data.otpChannel === "email" ? "Email" : "Mobile"));
                    window.location.href = "/verify-otp";
                } else {
                    alert("Registration Successful");
                    window.location.href = "/login";
                }
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.log(error);

            alert(
                "Registration Failed"
            );
        }
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent:
                    "center",
                alignItems: "center",
                height: "100vh",
                backgroundColor:
                    "#0f0f0f",
                color: "white",
            }}
        >
            <form
                onSubmit={handleRegister}
                style={{
                    width: "350px",
                    backgroundColor:
                        "#1c1c1c",
                    padding: "30px",
                    borderRadius: "12px",
                    display: "flex",
                    flexDirection:
                        "column",
                    gap: "15px",
                }}
            >
                <img
                    src={logo}
                    alt="VINORA"
                    className="logo"
                    style={{ height: "48px", objectFit: "contain", marginBottom: "10px" }}
                />
                <h2>Register</h2>

                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) =>
                        setName(
                            e.target.value
                        )
                    }
                    style={{
                        padding: "10px",
                    }}
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(
                            e.target.value
                        )
                    }
                    style={{
                        padding: "10px",
                    }}
                />

                <input
                    type="text"
                    placeholder="Mobile Number"
                    value={mobile}
                    onChange={(e) =>
                        setMobile(
                            e.target.value
                        )
                    }
                    style={{
                        padding: "10px",
                    }}
                />

                <input
                    type="text"
                    placeholder="State"
                    value={state}
                    onChange={(e) =>
                        setState(
                            e.target.value
                        )
                    }
                    style={{
                        padding: "10px",
                    }}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(
                            e.target.value
                        )
                    }
                    style={{
                        padding: "10px",
                    }}
                />

                <button
                    type="submit"
                    style={{
                        padding: "10px",
                        cursor: "pointer",
                    }}
                >
                    Register
                </button>

                <p>
                    Already have an account?{" "}
                    <Link to="/login">
                        Login
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Register;