const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema(
  {
    chatroom: {
      type: mongoose.Schema.Types.ObjectId,
      required: "Chatroom is required",
      ref: "ChatRoom",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: "User is required",
      ref: "User",
    },
    friendId: {
      type: mongoose.Schema.Types.ObjectId,
      required: "friend id is requried",
      ref: "User",
    },
    message: {
      type: String,
      required: "message is required",
    },
  },
  { timestamps: true }
);

module.exports = Message = mongoose.model("Message", MessageSchema);
