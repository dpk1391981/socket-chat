const app = require("./app");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
dotenv.config();
const connectDB = require("./models/db");

connectDB(mongoose);

require("./models/ChatRoom");
require("./models/User");
require("./models/Message");

const server = app.listen(process.env.PORT, () => {
  console.log(`Server running @ http://localhost:${process.env.PORT}/`);
});

const Message = mongoose.model("Message");
const User = mongoose.model("User");

const io = require("socket.io")(server);

io.use(async (socket, next) => {
  try {
    const token = socket.handshake.query.token;
    const { user } = await jwt.verify(token, process.env.JWTSECRET);
    socket.userId = user.id;
    console.log(`socket.userId: ${socket.userId}`);
    next();
  } catch (error) {}
});

//client socket config

io.on("connection", (socket) => {
  console.log(`Connected: ${socket.userId}`);

  socket.on("disconnect", () => {
    console.log(`Disconnected: ${socket.userId}`);
  });

  socket.on("joinRoom", ({ chatroomId }) => {
    socket.join(chatroomId);
    console.log("A user joined chatroom: " + chatroomId);
  });

  socket.on("leaveRoom", ({ chatroomId }) => {
    socket.leave(chatroomId);
    console.log("A user left chatroom: " + chatroomId);
  });
  socket.on("chatroomMessage", async ({ chatroomId, message }) => {
    if (message.trim().length > 0) {
      const user = await User.findOne({ _id: socket.userId });
      const newMessage = new Message({
        chatroom: chatroomId,
        user: socket.userId,
        message,
      });
      io.to(chatroomId).emit("newMessage", {
        message,
        name: user.name,
        userId: socket.userId,
      });
      await newMessage.save();
    }
  });
});
