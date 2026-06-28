const express = require("express");

const router = express.Router();


const {
    createOrder,
    verifyPayment
}
    =
    require("../controllers/paymentController");


const auth =
    require("../middleware/authMiddleware");



// CREATE ORDER

router.post(
    "/create-order",
    createOrder
);



// VERIFY PAYMENT

router.post(
    "/verify-payment",
    auth,
    verifyPayment
);



module.exports = router;