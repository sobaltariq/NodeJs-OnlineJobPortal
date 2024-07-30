const { Server } = require("socket.io");
const {
  verifyWSToken,
  checkWSApplicationStatus,
} = require("../api/middleware/webSocketMiddleware");
const {
  handleJoinRoom,
  handleSendMessage,
} = require("../api/services/ioChatService");

function initializeSocketServer(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type"],
      credentials: true,
    },
  });

  // Use the verifyWSToken middleware for WebSocket connections
  io.use(verifyWSToken);
  io.use(checkWSApplicationStatus);

  io.on("connection", (socket) => {
    console.log(`A user connected: ${socket.id}`);

    socket.on("joinRoom", async (applicationId) => {
      try {
        handleJoinRoom(socket, applicationId);
      } catch (err) {
        console.error("Error handling joinRoom:", err.message);
        socket.emit("error", "Internal server error when joining room.");
      }
    });

    socket.on("sendMessage", async (messageData) => {
      try {
        handleSendMessage(io, socket, messageData);
      } catch (err) {
        console.error("Error handling sendMessage:", err.message);
        socket.emit("error", "Internal server error when sending message.");
      }
    });

    socket.on("error", (message) => {
      console.error(`Error: ${message}`);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
}

module.exports = initializeSocketServer;
