const jwt = require("jsonwebtoken");


const authMiddleware = (req, res, next) => {


    try {


        console.log(
            "AUTH HEADER:",
            req.headers.authorization
        );


        const token =
            req.headers.authorization?.split(" ")[1];


        console.log(
            "TOKEN:",
            token
        );


        if (!token) {

            return res.status(401).json({
                message: "No token provided"
            });

        }



        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );



        req.user = decoded;


        next();



    }
    catch (error) {


        return res.status(401).json({
            message: "Invalid token"
        });


    }


};


module.exports = authMiddleware;