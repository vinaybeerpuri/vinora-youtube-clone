const mongoose = require("mongoose");


const paymentSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },


    plan: {
        type: String,
        required: true
    },


    amount: {
        type: Number,
        required: true
    },


    razorpay_order_id: {
        type: String,
        required: true
    },


    razorpay_payment_id: {
        type: String,
        required: true
    },


    status: {
        type: String,
        default: "success"
    }


},
    {
        timestamps: true
    });


module.exports =
    mongoose.model(
        "Payment",
        paymentSchema
    );