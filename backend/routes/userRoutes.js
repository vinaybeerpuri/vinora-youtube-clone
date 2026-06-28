const express = require("express");

const router = express.Router();

const protect =
    require("../middleware/authMiddleware");

const {
    upgradeUser
} = require("../controllers/userController");


router.put(
    "/upgrade",
    protect,
    upgradeUser
);


module.exports = router;