const express = require("express");
const { verifyLoginToken } = require("../middleware/verifyLogin");
const { getChatHistory, getAllUsers } = require("../controller/chatController");
require("../validator/createChatValidator");

const router = express.Router();

router.get("/:appId", verifyLoginToken, getChatHistory);
router.get("/users/:myId", verifyLoginToken, getAllUsers);

module.exports = router;
