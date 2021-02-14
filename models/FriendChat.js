const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const FriendChat = new Schema(
  {
    sendBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: "User is required",
      ref: "User",
    },
    sendTo: {
      type: mongoose.Schema.Types.ObjectId,
      required: "friend id is requried",
      ref: "User",
    },
    status: {
      type: String,
      required: "status required",
    },
  },
  { timestamps: true }
);

module.exports = Message = mongoose.model("Friend", FriendChat);
