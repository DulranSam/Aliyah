const express = require("express");
const router = express.Router();
const userModel = require("../models/user");
const bcrypt = require("bcrypt");

router.route("/").post(async (req, res) => {
  const { username, password } = req?.body;
  if (!username || !password)
    return res.status(400).json({ Alert: "Username/Password Missing!" });

  const validityUser = await userModel.findOne({ username });

  if (!validityUser) {
    const hashedPWD = bcrypt.hashSync(password, Math.random());

    await userModel.create({
      username,
      password:hashedPWD,
    });

    return res.status(201).json({ Alert: `${username} Registered!` });
  } else {
    return res.status(409).json({ Alert: `${username} Already Exists!` });
  }
});

module.exports = router;
