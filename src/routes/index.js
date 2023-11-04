const express = require("express");
const Router = express.Router();

Router.get("/", (req, res) => res.send("API is listening"));
Router.use("/auth", require("./auth/index"));
Router.use("/chat", require("./chat/index"));
Router.use("/message", require("./message/index"));

module.exports = Router;
