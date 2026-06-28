const express =
    require("express");

const router =
    express.Router();

const {
    registerUser,
    loginUser,
    getProfile,
    upgradeUser
} = require(
    "../controllers/authController"
);

const protect =
    require("../middleware/authMiddleware");




// REGISTER

router.post(
    "/register",
    registerUser
);




// LOGIN

router.post(
    "/login",
    loginUser
);




// PROTECTED PROFILE

router.get(
    "/profile",
    protect,
    getProfile
);

module.exports = router;
// UPGRADE TO PREMIUM

router.put(
    "/upgrade",
    protect,
    upgradeUser
);