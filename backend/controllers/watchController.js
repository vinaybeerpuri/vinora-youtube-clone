const User = require("../models/User");


// UPDATE WATCH TIME

const updateWatchTime = async (req, res) => {

    try {


        const user =
            await User.findById(
                req.user.id
            );



        if (!user) {

            return res.status(404).json({

                message: "User not found"

            });

        }



        // PREMIUM GOLD USERS

        if (
            user.isPremium &&
            user.plan === "Gold"
        ) {

            return res.json({

                message: "Unlimited watching",

                unlimited: true

            });

        }





        // CHECK LIMIT

        if (
            user.watchTimeUsed >= user.watchLimit
        ) {

            return res.status(403).json({

                message:
                    "Watch limit completed. Upgrade Premium"

            });

        }




        user.watchTimeUsed += 1;



        await user.save();




        res.json({

            message:
                "Watch time updated",

            watchTimeUsed:
                user.watchTimeUsed,

            watchLimit:
                user.watchLimit

        });



    }


    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};



module.exports = {
    updateWatchTime
};