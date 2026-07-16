const mongoose = require("mongoose");

const RecordingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    roomId: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    },
    duration: {
        type: Number, // seconds
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Recording", RecordingSchema);
