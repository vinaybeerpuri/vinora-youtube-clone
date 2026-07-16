import React from "react";
import { Navigate } from "react-router-dom";


const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    let user = null;
    try {
        user = userStr ? JSON.parse(userStr) : null;
    } catch (e) {
        console.error(e);
    }

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (!user || !user.isVerified) {
        const pendingUserId = localStorage.getItem("pendingUserId") || (user && user._id);
        if (pendingUserId) {
            localStorage.setItem("pendingUserId", pendingUserId);
            return <Navigate to="/verify-otp" />;
        }
        return <Navigate to="/login" />;
    }

    return children;
};


export default PrivateRoute;