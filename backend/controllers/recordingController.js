const Recording = require("../models/Recording");

// POST /api/recordings — save recording metadata
const saveRecording = async (req, res) => {
    try {
        const { roomId, filename, duration } = req.body;

        if (!roomId || !filename) {
            return res.status(400).json({ message: "roomId and filename are required" });
        }

        const recording = await Recording.create({
            userId: req.user.id,
            roomId,
            filename,
            duration: duration || 0
        });

        res.status(201).json({
            message: "Recording saved successfully",
            recording
        });
    } catch (error) {
        console.error("Save recording error:", error);
        res.status(500).json({ message: error.message });
    }
};

// GET /api/recordings — get all recordings for logged-in user
const getMyRecordings = async (req, res) => {
    try {
        const recordings = await Recording.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(recordings);
    } catch (error) {
        console.error("Get recordings error:", error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { saveRecording, getMyRecordings };
