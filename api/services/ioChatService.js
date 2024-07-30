const chatModel = require("../models/chatModel");
const applicationModel = require("../models/applicationModel");

const createChat = async (applicationId, applicationFound) => {
  const newChat = new chatModel({
    application: applicationId,
    employer: applicationFound.jobEmployer,
    seeker: applicationFound.jobSeeker,
    messages: [],
  });
  return await newChat.save();
};

const isUserInApplication = (user, application) => {
  return (
    application.jobEmployer.user.toString() === user.id ||
    application.jobSeeker.user.toString() === user.id
  );
};

const handleJoinRoom = async (socket, applicationId) => {
  const { user } = socket;
  console.log("applicationId", socket.applications);
  //   applicationId string 66a62ae82698bc9aa735a28c
  if (!socket.applications.includes(applicationId)) {
    console.log("Access denied. Cannot join this room");
    return socket.emit("error", "Access denied. Cannot join this room.");
  }
  const applicationFound = await applicationModel.findById(applicationId);
  if (!applicationFound) {
    console.log("Access denied. Cannot join this room");
    return socket.emit("error", "Access denied. Cannot join this room.");
  }
  //   console.log(applicationFound);

  // Create or find the chat for this application
  let chatFound = await chatModel.findOne({ application: applicationId });
  if (!chatFound) {
    await createChat(applicationId, applicationFound);
  }

  socket.join(applicationId);

  // Emit roomJoined event for confirmation
  socket.emit("roomJoined", applicationId);
  console.log(`Client ${socket.id} joined room: ${applicationId}`);
};

const handleSendMessage = async (io, socket, messageData) => {
  if (typeof messageData === "string") {
    try {
      messageData = JSON.parse(messageData);
    } catch (err) {
      console.error("Error parsing messageData as JSON:", err.message);
      return socket.emit("error", "Invalid JSON format.");
    }
  }

  const { applicationId, content } = messageData;

  const isInRoom = Array.from(socket.rooms).includes(applicationId);
  if (!isInRoom) {
    console.log("Access denied. Cannot send message to this room.");
    return socket.emit(
      "error",
      "Access denied. Cannot send message to this room."
    );
  }
  console.log("isInRoom", socket.rooms, isInRoom);
  const { user } = socket;
  // console.log(`applicationId: ${applicationId}, content: ${content}`);

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

  // check if user is in application
  if (!isUserInApplication(user, applicationFound)) {
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
    timestamp: new Date(),
  };

  chatFound.messages.push(newMessage);
  await chatFound.save();

  // Broadcast the new message to the room
  io.to(applicationId).emit("receiveMessage", newMessage);
  console.log("message sent");
};

const handleMessagesHistory = async (io, socket, applicationId) => {
  const isInRoom = Array.from(socket.rooms).includes(applicationId);
  if (!isInRoom) {
    console.log("Access denied. Cannot send message to this room.");
    return socket.emit(
      "error",
      "Access denied. Cannot send message to this room."
    );
  }
  console.log("isInRoom", socket.rooms, isInRoom);

  const chatFound = await chatModel.findOne({
    application: applicationId,
  });
  if (!chatFound) {
    console.error(`Chat history not found: ${error.message}`);
    socket.emit("error", "Chat history not found");
  }
  console.log("getChatHistory Found", chatFound.messages);
  socket.emit("chatHistory", chatFound.messages);
};

module.exports = {
  createChat,
  handleJoinRoom,
  handleSendMessage,
  handleMessagesHistory,
};
