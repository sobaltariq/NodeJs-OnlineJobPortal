const { Server } = require("socket.io");

function initializeSocketServer(server) {
  const io = new Server(
    server
    //     , {
    //     cors: {
    //       origin: ["http://localhost:3000"], // Adjust as needed
    //       methods: ["GET", "POST"],
    //   allowedHeaders: ["Authorization"],
    //     },
    //   }
  );

  io.on("connection", (socket) => {
    console.log(`A user connected: ${socket.id}`);

    // Listen for incoming chat messages
    socket.on("chat message", (msg) => {
      console.log("message: " + msg);
      io.emit("chat message", msg); // Broadcast to all connected clients
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
}

module.exports = initializeSocketServer;
