const { Server } = require("socket.io");
const {
  verifyWSToken,
  checkWSApplicationStatus,
} = require("../api/middleware/webSocketMiddleware");
const {
  handleJoinRoom,
  handleSendMessage,
  handleMessagesHistory,
} = require("../api/services/ioChatService");
const chatModel = require("../api/models/chatModel");

function initializeSocketServer(server) {
  const io = new Server(server, {
    cors: {
      origin: `${process.env.ALLOWED_ORIGINS}`,
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
        // console.log("applicationId found", applicationId);
        handleJoinRoom(socket, applicationId);
      } catch (err) {
        console.error("Error handling joinRoom:", err.message);
        socket.emit("error", "Internal server error when joining room.");
      }
    });

    socket.on("sendMessage", async (messageData) => {
      try {
        // console.log("messageData", messageData);
        handleSendMessage(io, socket, messageData);
      } catch (err) {
        console.error("Error handling sendMessage:", err.message);
        socket.emit("error", "Internal server error when sending message.");
      }
    });

    socket.on("getChatHistory", async (applicationId) => {
      try {
        // console.log("getChatHistory", applicationId);
        handleMessagesHistory(io, socket, applicationId);
      } catch (error) {
        console.error(`Error fetching chat history: ${error.message}`);
        socket.emit("error", "Error fetching chat history");
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
