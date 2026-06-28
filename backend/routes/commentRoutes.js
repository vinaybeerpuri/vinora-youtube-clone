const express = require("express");

const router = express.Router();

const Comment = require("../models/Comment");


// ADD COMMENT

router.post("/", async (req, res) => {
    try {
        const comment =
            await Comment.create(req.body);

        res.status(201).json(comment);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
});


// GET COMMENTS FOR VIDEO

router.get("/:videoId", async (req, res) => {
    try {

        const comments =
            await Comment.find({
                videoId: req.params.videoId,
            }).sort({
                createdAt: -1,
            });

        res.json(comments);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
});


// LIKE COMMENT

router.put("/:id/like", async (req, res) => {
    try {

        const comment =
            await Comment.findById(
                req.params.id
            );

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found",
            });
        }

        comment.likes += 1;

        await comment.save();

        res.json(comment);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
});


// DISLIKE COMMENT

router.put("/:id/dislike", async (req, res) => {
    try {

        const comment =
            await Comment.findById(
                req.params.id
            );

        if (!comment) {
            return res.status(404).json({
                message: "Comment not found",
            });
        }

        comment.dislikes += 1;

        if (comment.dislikes >= 2) {

            await Comment.findByIdAndDelete(
                comment._id
            );

            return res.json({
                deleted: true,
            });
        }

        await comment.save();

        res.json(comment);

    } catch (error) {

        res.status(500).json({
            message: error.message,
        });
    }
});

module.exports = router;