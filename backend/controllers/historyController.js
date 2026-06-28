const WatchHistory =
    require("../models/WatchHistory");

const Video =
    require("../models/Video");



// ADD WATCH HISTORY

const addHistory = async (req, res) => {


    try {


        const {
            videoId
        } = req.body;



        const video =
            await Video.findById(videoId);



        if (!video) {

            return res.status(404).json({

                message: "Video not found"

            });

        }




        // prevent duplicate history

        await WatchHistory.findOneAndDelete({

            userId: req.user.id,

            videoId: video._id

        });




        // create new history

        const history =
            await WatchHistory.create({

                userId: req.user.id,

                videoId: video._id,

                title: video.title,

                thumbnail: video.thumbnail

            });



        res.status(201).json(history);



    }

    catch (error) {


        res.status(500).json({

            message: error.message

        });


    }


};






// GET HISTORY


const getHistory = async (req, res) => {


    try {


        const history =
            await WatchHistory.find({

                userId: req.user.id

            })
                .sort({

                    createdAt: -1

                });



        res.json(history);



    }

    catch (error) {


        res.status(500).json({

            message: error.message

        });


    }



};



module.exports = {

    addHistory,

    getHistory

};