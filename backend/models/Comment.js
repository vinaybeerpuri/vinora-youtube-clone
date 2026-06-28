const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
    {
        videoId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video",
            required: true,
        },

        username: {
            type: String,
            required: true,
        },

        text: {
            type: String,
            required: true,
        },

        city: {
            type: String,
            default: "Unknown",
        },

        likes: {
            type: Number,
            default: 0,
        },

        dislikes: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "Comment",
    commentSchema
);