import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../config/api";
import { useTheme } from "../context/ThemeContext";
import logo from "../assets/vinora-logo.png";

const OtpVerify = () => {
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState("");
    const [channel, setChannel] = useState("email");
    const navigate = useNavigate();
    const { setTheme } = useTheme();

    useEffect(() => {
        const pendingUserId = localStorage.getItem("pendingUserId");
        const pendingChannel = localStorage.getItem("pendingChannel");
        
        if (!pendingUserId) {
            navigate("/login");
        } else {
            setUserId(pendingUserId);
            setChannel(pendingChannel || "email");
        }
    }, [navigate]);

    const handleVerify = async (e) => {
        e.preventDefault();
        if (otp.length !== 6) {
            alert("Please enter a valid 6-digit OTP");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${API}/api/auth/verify-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userId, otp })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data));
                
                // Clear pending registration/login data
                localStorage.removeItem("pendingUserId");
                localStorage.removeItem("pendingChannel");

                // Set dynamic theme returned by backend
                if (data.theme) {
                    setTheme(data.theme);
                }

                alert("Verification Successful!");
                window.location.href = "/";
            } else {
                alert(data.message || "Invalid OTP");
            }
        } catch (error) {
            console.error("Verification Error:", error);
            alert("Server Error during verification");
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API}/api/auth/resend-otp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ userId })
            });

            const data = await response.json();
            if (response.ok) {
                alert("A new OTP has been sent successfully!");
            } else {
                alert(data.message || "Failed to resend OTP");
            }
        } catch (error) {
            console.error("Resend Error:", error);
            alert("Server Error while resending OTP");
        } finally {
            setLoading(false);
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
                onSubmit={handleVerify}
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
                <img
                    src={logo}
                    alt="VINORA"
                    className="logo"
                    style={{ height: "48px", objectFit: "contain", marginBottom: "8px", display: "block", margin: "0 auto 8px" }}
                />

                <h2 style={{ textAlign: "center", margin: 0 }}>
                    OTP Verification
                </h2>

                <p style={{ fontSize: "14px", color: "#aaa", textAlign: "center" }}>
                    An OTP has been sent to your registered{" "}
                    <strong>{channel === "email" ? "Email Address" : "Mobile Number"}</strong>.
                </p>

                <input
                    type="text"
                    maxLength="6"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    style={{
                        padding: "10px",
                        textAlign: "center",
                        fontSize: "18px",
                        letterSpacing: "4px",
                        background: "#0f0f0f",
                        border: "1px solid #333",
                        color: "white",
                        borderRadius: "5px"
                    }}
                />

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: "10px",
                        cursor: "pointer",
                        background: "red",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        fontSize: "16px"
                    }}
                >
                    {loading ? "Verifying..." : "Verify OTP"}
                </button>

                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                    <button
                        type="button"
                        onClick={handleResend}
                        disabled={loading}
                        style={{
                            background: "transparent",
                            color: "#3ea6ff",
                            padding: 0,
                            border: "none",
                            cursor: "pointer"
                        }}
                    >
                        Resend OTP
                    </button>

                    <button
                        type="button"
                        onClick={() => {
                            localStorage.removeItem("pendingUserId");
                            localStorage.removeItem("pendingChannel");
                            navigate("/login");
                        }}
                        style={{
                            background: "transparent",
                            color: "#aaa",
                            padding: 0,
                            border: "none",
                            cursor: "pointer"
                        }}
                    >
                        Back to Login
                    </button>
                </div>
            </form>
        </div>
    );
};

export default OtpVerify;
