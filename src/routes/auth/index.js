const express = require("express");
const Router = express.Router();
const authController = require("../../controllers/authController");
const {protect}=require("../../helpers/middleware/protect");
Router.post("/register", authController.register);
Router.post("/login", authController.login);
Router.post("/verify", protect,authController.verify);

module.exports = Router;
