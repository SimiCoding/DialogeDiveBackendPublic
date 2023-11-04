const express = require("express");
const { protect } = require("../../helpers/middleware/protect");
const { verify } = require("../../helpers/middleware/verify");
const Router = express.Router();
const chatController = require("../../controllers/chatController");

Router.post("/", protect, verify, chatController.accessChat);
Router.get("/", protect, verify, chatController.fetchChats);
Router.post("/group", protect, verify, chatController.createGroupChat);
Router.put("/rename", protect, verify, chatController.renameGroup);
Router.put("/groupremove", protect, verify, chatController.removeFromGroup);
Router.put("/groupadd", protect, verify, chatController.addToGroup);

module.exports = Router;
