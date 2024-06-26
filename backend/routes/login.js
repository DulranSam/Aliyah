const express = require("express");
const router = express.Router();
const userModel = require("../models/user");
const bcrypt = require("bcrypt");
router.route("/").post(async (req, res) => {
  const { username, password } = req?.body;

  if (!username || !password) {
    return res.status(400).json({ Alert: "Username/Password Missing!" });
  }

  const validityUser = await userModel.findOne({ username });

  if (!validityUser) {
    return res.status(404).json({ Alert: "Invalid Username" });
  } else {
    // if (validityUser.password !== password) {
    //   return res.status(401).json({ Alert: "Unauthorized" });
    // }

    const passwordMatch = bcrypt.compareSync(password, validityUser.password);
    if (!passwordMatch) {
      return res.status(401).json({ Alert: "Unauthorized" });
    } else {
      return res.status(200).json({
        Alert: `${username} logged in!`,
        username: username,
        data: validityUser,
      });
    }
  }
});
module.exports = router;
