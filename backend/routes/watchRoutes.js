const express = require("express");

const router = express.Router();

const protect =
    require("../middleware/authMiddleware");


const {
    updateWatchTime
} = require("../controllers/watchController");



router.put(
    "/",
    protect,
    updateWatchTime
);



module.exports = router;