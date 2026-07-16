/**
 * VINORA WebRTC Signaling Server
 * --------------------------------
 * Events handled:
 *   join-room       → user joins a call room
 *   offer           → SDP offer from caller to callee
 *   answer          → SDP answer from callee to caller
 *   ice-candidate   → ICE candidates exchange
 *   leave-room      → user leaves gracefully
 *   disconnect      → socket disconnects (auto cleanup)
 */

// rooms: Map<roomId, Set<socketId>>
const rooms = new Map();

module.exports = (io) => {

    io.on("connection", (socket) => {
        console.log(`[Socket] Connected: ${socket.id}`);

        // ─────────────────────────────────────────────
        // JOIN ROOM
        // ─────────────────────────────────────────────
        socket.on("join-room", ({ roomId, userId, userName }) => {
            if (!roomId) return;

            // Max 2 peers per room
            if (!rooms.has(roomId)) {
                rooms.set(roomId, new Set());
            }

            const room = rooms.get(roomId);

            if (room.size >= 2) {
                socket.emit("room-full", { roomId });
                console.log(`[Socket] Room full: ${roomId}`);
                return;
            }

            room.add(socket.id);
            socket.join(roomId);
            socket.data.roomId = roomId;
            socket.data.userId = userId;
            socket.data.userName = userName;

            console.log(`[Socket] ${userName || socket.id} joined room ${roomId} (${room.size}/2)`);

            // Notify all others in the room that a new peer joined
            socket.to(roomId).emit("peer-joined", {
                socketId: socket.id,
                userId,
                userName,
                roomSize: room.size
            });

            // Tell the joining user how many people are in the room
            socket.emit("room-joined", {
                roomId,
                roomSize: room.size,
                existingPeers: [...room].filter((id) => id !== socket.id)
            });
        });

        // ─────────────────────────────────────────────
        // SDP OFFER  (caller → callee)
        // ─────────────────────────────────────────────
        socket.on("offer", ({ to, offer }) => {
            console.log(`[Socket] Offer from ${socket.id} → ${to}`);
            io.to(to).emit("offer", {
                from: socket.id,
                offer
            });
        });

        // ─────────────────────────────────────────────
        // SDP ANSWER  (callee → caller)
        // ─────────────────────────────────────────────
        socket.on("answer", ({ to, answer }) => {
            console.log(`[Socket] Answer from ${socket.id} → ${to}`);
            io.to(to).emit("answer", {
                from: socket.id,
                answer
            });
        });

        // ─────────────────────────────────────────────
        // ICE CANDIDATE
        // ─────────────────────────────────────────────
        socket.on("ice-candidate", ({ to, candidate }) => {
            io.to(to).emit("ice-candidate", {
                from: socket.id,
                candidate
            });
        });

        // ─────────────────────────────────────────────
        // LEAVE ROOM (graceful)
        // ─────────────────────────────────────────────
        socket.on("leave-room", ({ roomId }) => {
            handleLeave(socket, roomId, io);
        });

        // ─────────────────────────────────────────────
        // DISCONNECT (auto cleanup)
        // ─────────────────────────────────────────────
        socket.on("disconnect", () => {
            const roomId = socket.data.roomId;
            if (roomId) {
                handleLeave(socket, roomId, io);
            }
            console.log(`[Socket] Disconnected: ${socket.id}`);
        });
    });
};

// ─────────────────────────────────────────────
// Helper: leave / cleanup
// ─────────────────────────────────────────────
function handleLeave(socket, roomId, io) {
    socket.leave(roomId);

    if (rooms.has(roomId)) {
        rooms.get(roomId).delete(socket.id);
        if (rooms.get(roomId).size === 0) {
            rooms.delete(roomId);
        }
    }

    socket.data.roomId = null;

    // Notify remaining peers
    io.to(roomId).emit("peer-left", {
        socketId: socket.id,
        userId: socket.data.userId,
        userName: socket.data.userName
    });

    console.log(`[Socket] ${socket.id} left room ${roomId}`);
}
