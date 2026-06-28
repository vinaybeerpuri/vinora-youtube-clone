const express = require("express");

const router = express.Router();

const protect =
    require("../middleware/authMiddleware");

const {
    downloadVideo,
    getDownloads
} = require("../controllers/downloadController");


// DOWNLOAD VIDEO

const checkPremium =
    require("../middleware/premiumMiddleware");


router.post(
    "/",
    protect,
    checkPremium,
    downloadVideo
);


// GET DOWNLOAD HISTORY

router.get(
    "/",
    protect,
    getDownloads
);

module.exports = router;