const express = require("express");
const router = express.Router();

const {
    registerUser,
    loginUser,
    getProfile,
    upgradeUser,
    verifyOtp,
    resendOtp
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");

// REGISTER
router.post("/register", registerUser);

// LOGIN
router.post("/login", loginUser);

// VERIFY OTP
router.post("/verify-otp", verifyOtp);

// RESEND OTP
router.post("/resend-otp", resendOtp);

// PROTECTED PROFILE
router.get("/profile", protect, getProfile);

// UPGRADE TO PREMIUM
router.put("/upgrade", protect, upgradeUser);

module.exports = router;