const express = require("express");
const { verifyLoginToken } = require("../middleware/verifyLogin");
const { sendMessage, getChatHistory } = require("../controller/chatController");
const {
  createChatValidationRules,
} = require("../validator/createChatValidator");
const validateUser = require("../middleware/validateUser");

const router = express.Router();

router.get("/:appId", verifyLoginToken, getChatHistory);

module.exports = router;
