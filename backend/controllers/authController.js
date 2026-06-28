const User =
    require("../models/User");

const bcrypt =
    require("bcryptjs");

const jwt =
    require("jsonwebtoken");





// REGISTER USER

const registerUser =
    async (req, res) => {

        try {

            const {
                name,
                email,
                mobile,
                state,
                password
            } = req.body;





            // CHECK USER EXISTS

            const userExists =
                await User.findOne({
                    email
                });





            if (userExists) {

                return res.status(400).json({
                    message:
                        "User already exists"
                });
            }





            // HASH PASSWORD

            const salt =
                await bcrypt.genSalt(10);





            const hashedPassword =
                await bcrypt.hash(
                    password,
                    salt
                );





            // CREATE USER

            const user =
                await User.create({
                    name,
                    email,
                    mobile,
                    state,
                    password: hashedPassword
                });





            // GENERATE TOKEN

            const token =
                jwt.sign(

                    {
                        id: user._id
                    },

                    "SECRETKEY",

                    {
                        expiresIn: "7d"
                    }
                );





            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                state: user.state,
                token
            });

        }

        catch (error) {

            res.status(500).json({
                message:
                    error.message
            });
        }
    };





// LOGIN USER

// LOGIN USER

const loginUser = async (req, res) => {

    try {

        const {
            email,
            password
        } = req.body;

        const user =
            await User.findOne({
                email
            });

        if (!user) {

            return res.status(400).json({
                message: "User not found"
            });
        }

        const isMatch =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isMatch) {

            return res.status(400).json({
                message: "Invalid credentials"
            });
        }

        const token =
            jwt.sign(

                {
                    id: user._id
                },

                process.env.JWT_SECRET,

                {
                    expiresIn: "7d"
                }
            );

        res.status(200).json({

            _id: user._id,

            name: user.name,

            email: user.email,

            mobile: user.mobile,

            state: user.state,

            isPremium: user.isPremium,

            downloadsRemaining:
                user.downloadsRemaining,

            token
        });

    }

    catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};
const getProfile = async (req, res) => {

    res.status(200).json({
        message: "Protected Profile Access",
        user: req.user
    });
};
// UPGRADE TO PREMIUM

const upgradeUser = async (req, res) => {
    try {

        const user = await User.findById(
            req.user.id
        );

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        user.isPremium = true;

        await user.save();

        res.status(200).json({
            message: "Premium activated",
            isPremium: true
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};





module.exports = {
    registerUser,
    loginUser,
    getProfile,
    upgradeUser
};