const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {

        name: {
            type: String,
            required: true
        },


        email: {
            type: String,
            required: true,
            unique: true
        },


        mobile: {
            type: String,
            default: ""
        },


        state: {
            type: String,
            default: ""
        },


        password: {
            type: String,
            required: true
        },


        otp: {
            type: String,
            default: null
        },


        isVerified: {
            type: Boolean,
            default: false
        },


        // Premium status
        isPremium: {
            type: Boolean,
            default: false
        },


        // Free downloads count
        downloadsRemaining: {
            type: Number,
            default: 1
        },


        // Current plan
        plan: {
            type: String,
            default: "Free"
        },


        // Allowed watch time (minutes)
        watchLimit: {
            type: Number,
            default: 5
        },


        // Used watch time (minutes)
        watchTimeUsed: {
            type: Number,
            default: 0
        },


        // Premium expiry date
        subscriptionExpiry: {
            type: Date,
            default: null
        }

    },

    {
        timestamps: true
    }
);


module.exports =
    mongoose.model(
        "User",
        userSchema
    );