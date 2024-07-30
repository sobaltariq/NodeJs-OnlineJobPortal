const chatModel = require("../models/chatModel");

const getChatHistory = async (req, res) => {
  try {
    const { appId } = req.params;
    console.log("req.params.id", appId);
    const chatFound = await chatModel.findOne({ application: appId });
    //   .populate("seeker")
    //   .populate("employer");

    if (!chatFound) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }

    res.status(200).json({
      data: chatFound,
    });
  } catch (error) {
    console.error(error);
    res.status(501).json({
      message: "Internal server error when getting messages",
    });
  }
};

module.exports = {
  getChatHistory,
};
