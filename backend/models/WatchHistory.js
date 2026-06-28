const mongoose = require("mongoose");


const watchHistorySchema = new mongoose.Schema(

    {

        userId: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "User",

            required: true

        },


        videoId: {

            type: mongoose.Schema.Types.ObjectId,

            ref: "Video",

            required: true

        },


        title: {

            type: String,

            required: true

        },


        thumbnail: {

            type: String,

            default: ""

        },


        watchedAt: {

            type: Date,

            default: Date.now

        }


    },

    {
        timestamps: true
    }

);



module.exports =
    mongoose.model(
        "WatchHistory",
        watchHistorySchema
    );