const Razorpay = require("razorpay");
const crypto = require("crypto");
const User = require("../models/User");


const razorpay = new Razorpay({

    key_id: process.env.RAZORPAY_KEY_ID,

    key_secret: process.env.RAZORPAY_KEY_SECRET

});




// CREATE ORDER

const createOrder = async (req, res) => {

    try {

        const {
            amount,
            plan
        } = req.body;



        const order =
            await razorpay.orders.create({

                amount: amount * 100,

                currency: "INR",

                receipt:
                    "receipt_" + Date.now()

            });



        res.json({

            order,

            plan,

            key:
                process.env.RAZORPAY_KEY_ID

        });


    }

    catch (error) {

        console.log(error);


        res.status(500).json({

            message:
                "Order failed"

        });

    }

};








// VERIFY PAYMENT

const verifyPayment = async (req, res) => {


    try {


        const {

            razorpay_order_id,

            razorpay_payment_id,

            razorpay_signature,

            plan


        } = req.body;



        const sign =
            razorpay_order_id +
            "|" +
            razorpay_payment_id;




        const expected =
            crypto
                .createHmac(
                    "sha256",
                    process.env.RAZORPAY_KEY_SECRET
                )
                .update(sign)
                .digest("hex");





        if (expected !== razorpay_signature) {


            return res.status(400).json({

                message:
                    "Payment verification failed"

            });


        }







        const user =
            await User.findById(
                req.user.id
            );




        if (!user) {

            return res.status(404).json({

                message:
                    "User not found"

            });

        }






        // ACTIVATE PREMIUM


        user.isPremium = true;

        user.plan = plan;



        // SET PREMIUM EXPIRY
        // 30 DAYS VALIDITY


        user.subscriptionExpiry =
            new Date(
                Date.now() +
                30 * 24 * 60 * 60 * 1000
            );







        // PLAN SETTINGS


        if (plan === "Bronze") {

            user.watchLimit = 7;

        }



        else if (plan === "Silver") {


            user.watchLimit = 10;

        }



        else if (plan === "Gold") {


            user.watchLimit = 999999;

        }






        // PREMIUM USERS GET UNLIMITED DOWNLOADS

        user.downloadsRemaining = 999999;





        await user.save();







        res.json({

            message:
                "Premium Activated Successfully",

            user

        });



    }


    catch (error) {


        console.log(error);



        res.status(500).json({

            message:
                "Verification error"

        });


    }


};





module.exports = {

    createOrder,

    verifyPayment

};