const { Server } = require("socket.io");
const {
  verifyWSToken,
  checkWSApplicationStatus,
} = require("./api/middleware/webSocketMiddleware");
const chatModel = require("./api/models/chatModel");
const applicationModel = require("./api/models/applicationModel");

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
        const { user } = socket;
        // console.log("user: ", user, "id: ", applicationId);

        const applicationFound = await applicationModel.findById(applicationId);
        if (!applicationFound) {
          return socket.emit("Access denied. application not found.");
        }

        if (
          (user.role === "job seeker" && !applicationFound) ||
          (user.role === "employers" && !applicationFound)
        ) {
          console.log("Access denied. Invalid application.");
          return socket.emit("error", "Access denied. Invalid application.");
        }

        // Create or find the chat for this application
        let chatFound = await chatModel.findOne({ application: applicationId });
        if (!chatFound) {
          const newChat = new chatModel({
            application: applicationId,
            employer: applicationFound.jobEmployer,
            seeker: applicationFound.jobSeeker,
            messages: [],
          });
          await newChat.save();
        }
        socket.join(applicationId);

        // Emit roomJoined event for confirmation
        socket.emit("roomJoined", applicationId);
        console.log(`Client ${socket.id} joined room: ${applicationId}`);
      } catch (err) {
        console.error("Error handling joinRoom:", err.message);
        socket.emit("error", "Internal server error when joining room.");
      }
    });

    socket.on("sendMessage", async (messageData) => {
      try {
        if (typeof messageData === "string") {
          try {
            messageData = JSON.parse(messageData);
          } catch (err) {
            console.error("Error parsing messageData as JSON:", err.message);
            return socket.emit("error", "Invalid JSON format.");
          }
        }

        const { applicationId, content } = messageData;
        const { user } = socket;
        console.log(`applicationId: ${applicationId}, content: ${content}`);

        const applicationFound = await applicationModel
          .findById(applicationId)
          .populate([
            { path: "jobSeeker" },
            {
              path: "jobEmployer",
            },
          ]);
        if (!applicationFound) {
          return socket.emit("Access denied. application not found.");
        }
        console.log(
          applicationFound,
          applicationFound.jobEmployer.user,
          applicationFound.jobSeeker.user,
          user.id
        );

        // check if user is in application
        if (
          applicationFound.jobEmployer.user.toString() !== user.id &&
          applicationFound.jobSeeker.user.toString() !== user.id
        ) {
          console.log("Access denied. Invalid application.");
          return socket.emit("error", "Access denied. Invalid application.");
        }

        // check if chat exist or not
        let chatFound = await chatModel.findOne({ application: applicationId });
        if (!chatFound) {
          return socket.emit("error", "Chat not found");
        }

        const newMessage = {
          sender: user.id,
          content,
        };

        chatFound.messages.push(newMessage);
        await chatFound.save();

        // Broadcast the new message to the room
        io.to(applicationId).emit("receiveMessage", newMessage);
        console.log("message sent");
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
