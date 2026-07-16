const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendOtpEmail, sendOtpMobile } = require("../config/email");

const SOUTH_STATES = ["telangana", "andhra pradesh", "karnataka", "tamil nadu", "kerala"];
const isSouthIndia = (state = "") =>
    SOUTH_STATES.includes(state.toLowerCase().trim());

// REGISTER USER
const registerUser = async (req, res) => {
    try {
        const { name, email, mobile, state, password } = req.body;

        // CHECK USER EXISTS
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        // HASH PASSWORD
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // CREATE USER
        const user = await User.create({
            name,
            email,
            mobile,
            state,
            password: hashedPassword,
            otp,
            otpExpiry,
            isVerified: false
        });

        // Send OTP
        const isSouth = isSouthIndia(state);
        if (isSouth) {
            await sendOtpEmail(email, otp);
        } else {
            await sendOtpMobile(mobile, otp);
        }

        res.status(201).json({
            pendingOtp: true,
            userId: user._id,
            otpChannel: isSouth ? "email" : "mobile",
            message: "OTP sent successfully. Please verify to complete registration."
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// LOGIN USER
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        user.otp = otp;
        user.otpExpiry = otpExpiry;
        user.isVerified = false; // Require verification on login
        await user.save();

        // Send OTP
        const isSouth = isSouthIndia(user.state);
        if (isSouth) {
            await sendOtpEmail(user.email, otp);
        } else {
            await sendOtpMobile(user.mobile, otp);
        }

        res.status(200).json({
            pendingOtp: true,
            userId: user._id,
            otpChannel: isSouth ? "email" : "mobile",
            message: "OTP sent successfully. Please verify to complete login."
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// VERIFY OTP
const verifyOtp = async (req, res) => {
    try {
        const { userId, otp } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (!user.otp || user.otp !== otp) {
            return res.status(400).json({
                message: "Invalid OTP"
            });
        }

        if (user.otpExpiry && user.otpExpiry < new Date()) {
            return res.status(400).json({
                message: "OTP expired"
            });
        }

        // OTP verified
        user.isVerified = true;
        user.otp = null;
        user.otpExpiry = null;
        await user.save();

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET || "SECRETKEY",
            { expiresIn: "7d" }
        );

        // Determine Theme based on location and IST login time
        const now = new Date();
        const istString = now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
        const istDate = new Date(istString);
        const hour = istDate.getHours();
        const minute = istDate.getMinutes();
        const totalMinutes = hour * 60 + minute;
        
        // Window: 10:00 AM IST (600 mins) to 12:00 PM IST (720 mins)
        const isMorningWindow = totalMinutes >= 10 * 60 && totalMinutes <= 12 * 60;
        const isSouth = isSouthIndia(user.state);
        const theme = (isMorningWindow && isSouth) ? "light" : "dark";

        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            state: user.state,
            isPremium: user.isPremium,
            downloadsRemaining: user.downloadsRemaining,
            isVerified: user.isVerified,
            token,
            theme
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// RESEND OTP
const resendOtp = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

        user.otp = otp;
        user.otpExpiry = otpExpiry;
        await user.save();

        const isSouth = isSouthIndia(user.state);
        if (isSouth) {
            await sendOtpEmail(user.email, otp);
        } else {
            await sendOtpMobile(user.mobile, otp);
        }

        res.status(200).json({
            success: true,
            otpChannel: isSouth ? "email" : "mobile",
            message: "OTP resent successfully."
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

const getProfile = async (req, res) => {
    res.status(200).json({
        message: "Protected Profile Access",
        user: req.user
    });
};

// UPGRADE TO PREMIUM
const upgradeUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.isPremium = true;
        await user.save();

        res.status(200).json({
            message: "Premium activated",
            isPremium: true
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    verifyOtp,
    resendOtp,
    getProfile,
    upgradeUser
};