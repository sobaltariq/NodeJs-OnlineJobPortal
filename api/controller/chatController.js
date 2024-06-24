const chatModel = require("../models/chatModel");

const getChatHistory = async (req, res) => {
  try {
    const chatId = req.params.id;
    const chatFound = await chatModel
      .find({ chatId })
      .populate("seeker")
      .populate("employer");

    if (!chatFound) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    res.status(200).json({
      chatFound,
    });
  } catch (error) {
    console.error(error);
    res.status(501).json({
      message: "Internal server error when getting messages",
    });
  }
};

const sendMessage = (wss) => async (req, res, next) => {
  try {
    const userId = req.user?.id; // Ensure req.user exists before accessing properties
    const userRole = req.user?.role;
    const { application, employer, seeker, message } = req.body;

    console.log(userId);
    console.log(application, employer, seeker, message);

    const chatFound = await chatModel.findOne({ employer, seeker });

    if (!chatFound && userRole !== "employer") {
      return res.status(403).json({
        message: "Only employers can start a chat.",
      });
    }

    const newChatMessage = new chatModel({
      application,
      employer,
      seeker,
      message,
    });

    await newChatMessage.save();

    const wsMessage = JSON.stringify({
      application,
      employer,
      seeker,
      message,
      sender: userId,
      timestamp: new Date(),
    });

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(wsMessage);
      }
    });

    return res.status(200).json({
      message: "Message Sent Successfully",
      data: newChatMessage,
    });
  } catch (err) {
    console.error(err.message);
    res.status(501).json({
      error: "Internal server error when sending a message",
    });
  }
};

module.exports = {
  sendMessage,
  getChatHistory,
};
