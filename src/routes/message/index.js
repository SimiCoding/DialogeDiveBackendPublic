const express = require("express");
const Router = express.Router();
const messageController = require("../../controllers/messageController");
const { protect } = require("../../helpers/middleware/protect");
const { verify } = require("../../helpers/middleware/verify");

Router.get("/:chatId", protect, verify, messageController.allMessages);
Router.post("/", protect, verify, messageController.sendMessage);

module.exports = Router;
