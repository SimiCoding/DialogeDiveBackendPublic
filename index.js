// Requirements

const express = require("express");

const morgan = require("morgan");

const dotenv = require("dotenv").config({ path: ".env" });

const cors = require("cors");

const { log } = require("./src/helpers/functions/log");

// Connect to MongoDB

require("./src/helpers/functions/connectDb");

// Initialize app

const app = express();

// Configure Cors

const corsOptions = { origin: process.env.ALLOW_ORIGIN };
// Configure App

app.use(require("./src/helpers/handlers/responseHandler/index"));
app.use(express.json());
app.use(morgan("dev"));
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

// Configure App Routes

app.use(require("./src/routes/index"));

// Start App

const server = app.listen(process.env.PORT, () => {
  log(`Server listening on Port ${process.env.PORT}`, "success");
});

// Configure Socket
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
    // credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    let chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});