const express = require("express");
const { verifyLoginToken } = require("../middleware/verifyLogin");
const { sendMessage, getChatHistory } = require("../controller/chatController");
const {
  createChatValidationRules,
} = require("../validator/createChatValidator");
const validateUser = require("../middleware/validateUser");

module.exports = (wss) => {
  const router = express.Router();

  router.post(
    "/send",
    verifyLoginToken,
    createChatValidationRules(),
    validateUser,
    sendMessage(wss) // Pass wss to sendMessage function
  );

  router.get("/:id/message", verifyLoginToken, getChatHistory);

  return router;
};
