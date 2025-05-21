const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const connectDatabase = require("./config/database");
const app = require("./app");

const {
  getUserMatchOddsAndInvestment,
  getBetfairOddsForRunner,
  getScoreboardByEventId,
} = require("./controller/matchController");

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error(`❌ Uncaught Exception: ${err.message}`);
  process.exit(1);
});

// Load environment variables
dotenv.config({ path: path.join(__dirname, "config", "config.env") });

// Connect to MongoDB
connectDatabase();

// Create HTTP server
const server = http.createServer(app);
console.log("✅ HTTP server initialized.");

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:3000",
      "http://192.168.1.7:3000",
      "https://betinfo.live",
      "https://backend.betinfo.live"
    ],
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Make io available in all requests (for controllers)
app.set("io", io);

// Socket.IO Events
io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  socket.emit("welcome", { message: "Welcome to Betinfo Live!" });

  socket.on("join", (roomId) => {
    socket.join(roomId);
    console.log(`✅ Socket ${socket.id} joined room: ${roomId}`);
  });

  socket.on("leave", (roomId) => {
    socket.leave(roomId);
    console.log(`🚪 Socket ${socket.id} left room: ${roomId}`);
  });

  socket.on("sendMessage", (data) => {
    console.log("📩 Chat message received:", data);
    io.emit("receiveMessage", data);
  });

  // Real-time user odds update
  socket.on("requestUserOddsUpdate", async ({ eventId, userId }) => {
    console.log(`📩 User odds requested for eventId: ${eventId}, userId: ${userId}`);
    try {
      if (!eventId || !userId) throw new Error("eventId and userId are required");
      // Call controller and emit directly
      const req = { params: { eventId }, user: { _id: userId }, app };
      const res = {
        status: () => ({
          json: (data) => {
            // Emit live odds to user room
            io.to(userId).emit("userOddsUpdated", { success: true, ...data });
          }
        })
      };
      const next = (err) => err && console.error("UserOdds Error:", err.message);
      await getUserMatchOddsAndInvestment(req, res, next);
    } catch (err) {
      console.error("❌ requestUserOddsUpdate Error:", extractErrorDetails(err));
      io.to(userId).emit("userOddsUpdated", { success: false, error: err.message });
    }
  });

  // General odds update for event (admin push or fallback)
  socket.on("requestOddsUpdate", async ({ eventId }) => {
    console.log(`📩 Odds update requested for eventId: ${eventId}`);
    try {
      if (!eventId) throw new Error("eventId is required");
      const req = { params: { eventId }, app };
      const res = { status: () => ({ json: () => {} }) };
      const next = (err) => err && console.error("Odds Error:", err.message);
      await getBetfairOddsForRunner(req, res, next);
    } catch (err) {
      console.error("❌ requestOddsUpdate Error:", extractErrorDetails(err));
    }
  });

  // Scoreboard update for event
  socket.on("requestScoreboardUpdate", async ({ eventId }) => {
    console.log(`📩 Scoreboard update requested for eventId: ${eventId}`);
    try {
      if (!eventId) throw new Error("eventId is required");
      const req = { params: { eventId }, app };
      const res = { status: () => ({ json: () => {} }) };
      const next = (err) => err && console.error("Scoreboard Error:", err.message);
      await getScoreboardByEventId(req, res, next);
    } catch (err) {
      console.error("❌ requestScoreboardUpdate Error:", extractErrorDetails(err));
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", extractErrorDetails(err));
  server.close(() => process.exit(1));
});

// Graceful shutdown on SIGTERM
process.on("SIGTERM", () => {
  console.log("📴 SIGTERM received. Shutting down...");
  server.close(() => {
    console.log("✅ Server shutdown complete.");
  });
});

// Utility to extract full error details (esp. Axios)
function extractErrorDetails(err) {
  if (err.response) {
    return {
      status: err.response.status,
      data: err.response.data,
      message: err.message,
    };
  }
  return { message: err.message || err.toString() };
}
