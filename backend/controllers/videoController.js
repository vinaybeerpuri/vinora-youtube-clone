const Video = require("../models/Video");


// ==============================
// ADD VIDEO
// POST /api/videos
// ==============================

const addVideo = async (req, res) => {

    try {

        const {
            title,
            thumbnail,
            channel,
            views,
            videoUrl
        } = req.body;


        const video = await Video.create({

            title,

            thumbnail,

            channel,

            views: views || 0,

            videoUrl,

            likes: 0,

            user: req.user.id

        });

        res.status(201).json(video);


    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};




// ==============================
// GET ALL VIDEOS
// GET /api/videos
// ==============================

const getVideos = async (req, res) => {

    try {

        const videos = await Video.find();


        res.status(200).json(videos);


    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};




// ==============================
// GET SINGLE VIDEO
// GET /api/videos/:id
// ==============================

const getVideoById = async (req, res) => {

    try {

        const video =
            await Video.findById(req.params.id);


        if (!video) {

            return res.status(404).json({

                message: "Video not found"

            });

        }


        res.status(200).json(video);


    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};




// ==============================
// LIKE VIDEO
// PUT /api/videos/:id/like
// ==============================

const likeVideo = async (req, res) => {

    try {

        const video =
            await Video.findById(req.params.id);


        if (!video) {

            return res.status(404).json({

                message: "Video not found"

            });

        }


        video.likes =
            (video.likes || 0) + 1;


        await video.save();


        res.status(200).json({

            likes: video.likes

        });


    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};




// ==============================
// SEARCH VIDEOS
// GET /api/videos/search?q=value
// ==============================

const searchVideos = async (req, res) => {

    try {

        const keyword = req.query.q;


        if (!keyword) {

            return res.json([]);

        }


        const videos =
            await Video.find({

                $or: [

                    {
                        title: {
                            $regex: keyword,
                            $options: "i"
                        }
                    },


                    {
                        channel: {
                            $regex: keyword,
                            $options: "i"
                        }
                    }

                ]

            });


        res.status(200).json(videos);


    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};
// ==============================
// GET MY VIDEOS
// GET /api/videos/myvideos
// ==============================

const getMyVideos = async (req, res) => {

    try {

        const videos = await Video.find({
            user: req.user.id

        });


        res.status(200).json(videos);


    }
    catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};





// ==============================
// UPDATE VIDEO
// PUT /api/videos/:id
// ==============================

const updateVideo = async (req, res) => {

    try {


        const video =
            await Video.findOne({
                _id: req.params.id,
                user: req.user.id
            });



        if (!video) {

            return res.status(404).json({
                message: "Video not found"
            });

        }








        video.title =
            req.body.title || video.title;


        video.thumbnail =
            req.body.thumbnail || video.thumbnail;


        video.videoUrl =
            req.body.videoUrl || video.videoUrl;



        await video.save();



        res.status(200).json(video);


    }
    catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

};







// ==============================
// DELETE VIDEO
// DELETE /api/videos/:id
// ==============================

const deleteVideo = async (req, res) => {


    try {


        const video =
            await Video.findOne({

                _id: req.params.id,

                user: req.user.id

            });



        if (!video) {

            return res.status(404).json({
                message: "Video not found"
            });

        } {

            return res.status(403).json({
                message: "Not authorized"
            });

        }




        await video.deleteOne();



        res.status(200).json({

            message: "Video deleted successfully"

        });



    }
    catch (error) {

        res.status(500).json({
            message: error.message
        });

    }


};



module.exports = {

    addVideo,

    getVideos,

    getVideoById,

    likeVideo,

    searchVideos,

    getMyVideos,

    updateVideo,

    deleteVideo

};