require("./dns-fix");
const express = require("express");
const userRoutes =
    require("./routes/userRoutes");
const cors = require("cors");
const watchRoutes =
    require("./routes/watchRoutes");

require("dotenv").config();
const profileRoutes =
    require("./routes/profileRoutes");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const downloadRoutes = require("./routes/downloadRoutes");
const videoRoutes = require("./routes/videoRoutes");
const commentRoutes = require("./routes/commentRoutes");
const paymentRoutes =
    require(
        "./routes/paymentRoutes"
    );
const historyRoutes =
    require("./routes/historyRoutes");

const app = express();

connectDB();

app.use(cors());
app.use(express.json());


// AUTH ROUTES

app.use(
    "/api/auth",
    authRoutes
);
app.use(
    "/api/profile",
    profileRoutes
);


// DOWNLOAD ROUTES

app.use(
    "/api/download",
    downloadRoutes
);
app.use(
    "/api/history",
    historyRoutes
);
app.use(
    "/api/watch",
    watchRoutes
);

// VIDEO ROUTES

app.use(
    "/api/videos",
    videoRoutes
);


// COMMENT ROUTES

app.use(
    "/api/comments",
    commentRoutes
);
app.use(
    "/api/payment",
    paymentRoutes
);
app.use(
    "/api/users",
    userRoutes
);

app.get("/", (req, res) => {
    res.send(
        "Backend Running Successfully"
    );
});

const PORT =
    process.env.PORT || 5000;


app.listen(
    PORT,
    "0.0.0.0",
    () => {

        console.log(
            `Server running on port ${PORT}`
        );

    }
);