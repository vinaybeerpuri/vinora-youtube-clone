const express = require("express");

const router = express.Router();

const authMiddleware =
    require("../middleware/authMiddleware");


const {

    getVideos,

    getVideoById,

    likeVideo,

    searchVideos,

    addVideo,

    getMyVideos,

    updateVideo,

    deleteVideo

} = require("../controllers/videoController");





// ==============================
// GET ALL VIDEOS
// GET /api/videos
// ==============================

router.get(
    "/",
    getVideos
);





// ==============================
// SEARCH VIDEOS
// GET /api/videos/search?q=value
// ==============================

router.get(
    "/search",
    searchVideos
);






// ==============================
// GET MY VIDEOS
// GET /api/videos/myvideos
// ==============================

router.get(
    "/myvideos",
    authMiddleware,
    getMyVideos
);






// ==============================
// ADD VIDEO
// POST /api/videos
// ==============================

router.post(
    "/",
    authMiddleware,
    addVideo
);






// ==============================
// UPDATE VIDEO
// PUT /api/videos/:id
// ==============================

router.put(
    "/:id",
    authMiddleware,
    updateVideo
);






// ==============================
// DELETE VIDEO
// DELETE /api/videos/:id
// ==============================

router.delete(
    "/:id",
    authMiddleware,
    deleteVideo
);







// ==============================
// GET SINGLE VIDEO
// GET /api/videos/:id
// ==============================

router.get(
    "/:id",
    getVideoById
);






// ==============================
// LIKE VIDEO
// PUT /api/videos/:id/like
// ==============================

router.put(
    "/:id/like",
    authMiddleware,
    likeVideo
);





module.exports = router;