const express =
    require("express");


const router =
    express.Router();


const protect =
    require("../middleware/authMiddleware");


const {

    addHistory,

    getHistory

} = require("../controllers/historyController");




// ADD HISTORY

router.post(

    "/",

    protect,

    addHistory

);




// GET HISTORY

router.get(

    "/",

    protect,

    getHistory

);



module.exports = router;