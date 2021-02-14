const express = require("express");
const router = express.Router();
const Friend = require("../../models/FriendChat");
const { body, validationResult } = require("express-validator");
const auth = require("../../handlers/auth");

/**
 * @route POST api/users
 * @desc Register users
 * @access Public
 */
router.post(
  "/",
  [
    auth,
    body("friends", "friend id is required!!!").not().isEmpty(),
    body("status", "status is required!!!").not().isEmpty(),
  ],
  async (req, res) => {
    try {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
      }

      const { friends, status } = req.body;
      let friend = await Friend.findOne({ friends });

      if (friend && friend.status == "approved") {
        return res
          .status(400)
          .json({ errors: [{ msg: "you are already in friend list" }] });
      }

      if (friend && friend.status == "pending") {
        return res
          .status(400)
          .json({ errors: [{ msg: "already sent request" }] });
      }

      let saveFrindsParams = {
        sendTo: friends,
        sendBy: req.user.id,
        status,
      };

      friend = new Friend(saveFrindsParams);
      await friend.save();
      res.json({ msg: "Request Sent" });
    } catch (error) {
      console.log(`Error @friends friends: ${error.message}`);
      res.status(500).send("Server Error");
    }
  }
);

/**
 * @route POST api/chatroom
 * @desc create chat room
 * @access private
 */
router.get("/list", [auth], async (req, res) => {
  try {
    console.log(req.params);
    let friends = await Friend.find({})
      .populate("sendBy", ["name", "_id"])
      .populate("sendTo", ["name", "_id"])
      .lean()
      .exec();

    let approvedFriend = friends.filter((u) => u.status == "approved");
    let pendingList = friends.filter((u) => u.status == "pending");
    return res.status(200).json({
      friendList: approvedFriend.map((e) => e["sendBy"]),
      pendingListRequestTo: pendingList.map((e) => e["sendTo"]),
      pendingListRequestedBy: pendingList.map((e) => e["sendBy"]),
    });
  } catch (error) {
    console.log(`Error @get friends: ${error}`);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
