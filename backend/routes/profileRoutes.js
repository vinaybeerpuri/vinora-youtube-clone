const express = require("express");

const router = express.Router();

const {
    getProfile
} = require("../controllers/profileController");

const authMiddleware = require("../middleware/authMiddleware");


router.get(
    "/",
    authMiddleware,
    getProfile
);


module.exports = router;