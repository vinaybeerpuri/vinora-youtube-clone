const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { saveRecording, getMyRecordings } = require("../controllers/recordingController");

// POST /api/recordings — save a recording (auth required)
router.post("/", authMiddleware, saveRecording);

// GET /api/recordings — get all recordings for the user (auth required)
router.get("/", authMiddleware, getMyRecordings);

module.exports = router;
