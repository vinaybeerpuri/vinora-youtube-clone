require("./dns-fix");
require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const downloadRoutes = require("./routes/downloadRoutes");
const historyRoutes = require("./routes/historyRoutes");
const watchRoutes = require("./routes/watchRoutes");
const videoRoutes = require("./routes/videoRoutes");
const commentRoutes = require("./routes/commentRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const userRoutes = require("./routes/userRoutes");
const recordingRoutes = require("./routes/recordingRoutes");

// Socket signaling handler
const registerSocketHandlers = require("./socket/index");

const app = express();
const server = http.createServer(app);

// ─── Socket.IO ─────────────────────────────────────────────────────────────
const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

registerSocketHandlers(io);

// ─── Middleware ─────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Connect DB ─────────────────────────────────────────────────────────────
connectDB();

// ─── REST Routes ─────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/download", downloadRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/watch", watchRoutes);
app.use("/api/videos", videoRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/recordings", recordingRoutes);

app.get("/", (req, res) => {
    res.send("Backend Running Successfully");
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Socket.IO signaling server active`);
});