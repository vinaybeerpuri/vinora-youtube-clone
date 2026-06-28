const User =
    require("../models/User");


const upgradeUser =
    async (req, res) => {

        try {

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


            const upgradeUser = async (req, res) => {

                try {

                    const { plan } = req.body;


                    const user =
                        await User.findById(
                            req.user.id
                        );


                    if (!user) {

                        return res.status(404).json({
                            message: "User not found"
                        });

                    }


                    user.isPremium = true;


                    user.plan = plan;


                    if (plan === "Bronze") {

                        user.watchLimit = 7;

                    }

                    else if (plan === "Silver") {

                        user.watchLimit = 10;

                    }

                    else if (plan === "Gold") {

                        user.watchLimit = -1;

                    }


                    await user.save();


                    res.json({

                        message:
                            `${plan} plan activated`,

                        user

                    });


                }

                catch (error) {

                    res.status(500).json({
                        message: error.message
                    });

                }

            };


            await user.save();


            res.status(200).json({

                message:
                    "Premium activated",

                user

            });


        }

        catch (error) {

            res.status(500).json({

                message:
                    error.message

            });

        }

    };


module.exports = {

    upgradeUser

};