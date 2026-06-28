const Download =
    require("../models/Download");

const User =
    require("../models/User");

const Video =
    require("../models/Video");


// DOWNLOAD VIDEO

const downloadVideo = async (req, res) => {

    try {

        const { videoId } = req.body;


        const user =
            await User.findById(
                req.user.id
            );


        const video =
            await Video.findById(
                videoId
            );


        if (!video) {

            return res.status(404).json({

                message:
                    "Video not found"

            });

        }



        // CHECK PREMIUM EXPIRY

        if (
            user.isPremium &&
            user.subscriptionExpiry &&
            user.subscriptionExpiry < new Date()
        ) {


            user.isPremium = false;

            user.plan = "Free";

            user.watchLimit = 5;

            user.downloadsRemaining = 1;

            user.watchTimeUsed = 0;

            user.subscriptionExpiry = null;



            await user.save();

        }




        // FREE USER DOWNLOAD LIMIT

        if (
            !user.isPremium &&
            user.downloadsRemaining <= 0
        ) {


            return res.status(403).json({

                message:
                    "Free users can download only one video. Upgrade to Premium."

            });


        }




        // CREATE DOWNLOAD RECORD


        const download =
            await Download.create({

                userId:
                    user._id,

                videoId:
                    video._id,

                title:
                    video.title,

                videoUrl:
                    video.videoUrl

            });





        // REDUCE FREE DOWNLOAD COUNT


        if (!user.isPremium) {


            user.downloadsRemaining -= 1;


            await user.save();


        }




        res.status(201).json({

            message:
                "Video downloaded successfully",

            download

        });



    }


    catch (error) {


        console.log(error);


        res.status(500).json({

            message:
                error.message

        });


    }

};




// GET USER DOWNLOADS

const getDownloads = async (req, res) => {


    try {


        const downloads =
            await Download.find({

                userId:
                    req.user.id

            })
                .sort({
                    createdAt: -1
                });



        res.json(downloads);


    }


    catch (error) {


        res.status(500).json({

            message:
                error.message

        });


    }


};



module.exports = {

    downloadVideo,

    getDownloads

};