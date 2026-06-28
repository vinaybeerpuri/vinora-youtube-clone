const User = require("../models/User");


const checkPremium = async (req, res, next) => {

    try {

        const user =
            await User.findById(req.user.id);


        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }


        // Check premium expiry

        if (
            user.isPremium &&
            user.subscriptionExpiry &&
            user.subscriptionExpiry < new Date()
        ) {


            user.isPremium = false;

            user.plan = "Free";

            user.watchLimit = 5;

            user.watchTimeUsed = 0;

            user.downloadsRemaining = 1;


            user.subscriptionExpiry = null;


            await user.save();


            return res.status(403).json({

                message:
                    "Premium subscription expired"

            });

        }


        next();


    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};


module.exports = checkPremium;