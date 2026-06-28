const mongoose = require("mongoose");

const downloadSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        videoId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video",
            required: true,
        },

        title: String,

        videoUrl: String,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "Download",
    downloadSchema
);