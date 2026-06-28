const mongoose = require("mongoose");


const videoSchema = new mongoose.Schema(

    {
        title: {
            type: String,
            required: true
        },


        thumbnail: {
            type: String,
            required: true
        },


        channel: {
            type: String,
            required: true
        },


        views: {
            type: String,
            default: "0"
        },


        videoUrl: {
            type: String,
            required: true
        },


        likes: {
            type: Number,
            default: 0
        },


        subscribers: {
            type: Number,
            default: 1000
        },


        // OWNER OF VIDEO
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }

    },

    {
        timestamps: true
    }


);


module.exports = mongoose.model(
    "Video",
    videoSchema
);