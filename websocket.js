const { Server } = require("socket.io");

function initializeSocketServer(server) {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`A user connected: ${socket.id}`);

    // Listen for incoming chat messages
    socket.on("chat message", (chat) => {
      // console.log("message: " + message);
      console.log("message: " + JSON.stringify(chat, null, 2));
      io.emit("chat message", chat);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
}

module.exports = initializeSocketServer;
