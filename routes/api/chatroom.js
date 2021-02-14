const express = require("express");
const router = express.Router();
const ChatRoom = require("../../models/ChatRoom");
const auth = require("../../handlers/auth");
const { body, validationResult } = require("express-validator");

/**
 * @route POST api/chatroom
 * @desc create chat room
 * @access private
 */
router.post(
  "/",
  [auth, body("name", "Name is required!!!").not().isEmpty()],
  async (req, res) => {
    try {
      console.log(req.body);
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
      }

      const { name } = req.body;
      const nameRegex = /^[A-Za-z\s]+$/;

      if (!nameRegex.test(name)) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Chat room contain only alphabets" }] });
      }

      let chatroom = await ChatRoom.findOne({ name });

      if (chatroom) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Chatroom already exists" }] });
      }

      chatroom = new ChatRoom({
        name,
      });

      //Save user
      let dataSave = await chatroom.save();

      return res.status(201).json({ msg: "Chatroom Created", data: dataSave });
    } catch (error) {
      console.log(`Error @create chatroom: ${error}`);
      res.status(500).send("Server Error");
    }
  }
);

/**
 * @route POST api/chatroom
 * @desc create chat room
 * @access private
 */
router.get("/", [auth], async (req, res) => {
  try {
    let chatroom = await ChatRoom.find({});

    if (!chatroom) {
      return res.status(404).json({ errors: [{ msg: "No chat room found" }] });
    }

    return res.status(200).json(chatroom);
  } catch (error) {
    console.log(`Error @create chatroom: ${error}`);
    res.status(500).send("Server Error");
  }
});

/**
 * @route POST api/chatroom
 * @desc create chat room
 * @access private
 */
router.get("/:chatRoomId", [auth], async (req, res) => {
  try {
    let chatroom = await ChatRoom.findById(req.params.chatRoomId);

    if (!chatroom) {
      return res.status(404).json({ errors: [{ msg: "No chat room found" }] });
    }

    return res.status(200).json(chatroom);
  } catch (error) {
    console.log(`Error @create chatroom: ${error}`);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
