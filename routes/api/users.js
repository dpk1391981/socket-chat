const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const Friend = require("../../models/FriendChat");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../../handlers/auth");

/**
 * @route POST api/users
 * @desc Register users
 * @access Public
 */
router.post(
  "/",
  [
    body("name", "Name is required!!!").not().isEmpty(),
    body("email", "Please include a validate email address!!!").isEmail(),
    body("password", "Please enter with 6 or more character!!!").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    try {
      console.log(req.body);
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
      }

      const { name, email, password } = req.body;
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists!!!" }] });
      }

      user = new User({
        name,
        email,
        password,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      //Save user
      await user.save();
      let payload = {
        user: {
          id: user.id,
        },
      };
      //jwt token
      jwt.sign(
        payload,
        process.env.JWTSECRET,
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (error) {
      console.log(`Error @register user: ${error.message}`);
      res.status(500).send("Server Error");
    }
  }
);

/**
 * @route POST api/chatroom
 * @desc create chat room
 * @access private
 */
router.get("/:user", [auth], async (req, res) => {
  try {
    console.log(req.params);
    let users = await User.find({}).select("-password");
    if (req.params.user != "all") {
      users = await User.findById(req.params.user).select("-password");
      users = [users];
    }

    if (!users) {
      return res.status(404).json({ errors: [{ msg: "No user found" }] });
    }

    users = users.filter((u) => u._id != req.user.id);

    let friendsData = await Friend.findOne({ users: req.user.id });

    if (friendsData) {
      users = users.filter((f) => String(f._id) != String(friendsData.friends));
    }

    return res.status(200).json(users);
  } catch (error) {
    console.log(`Error @create chatroom: ${error}`);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
