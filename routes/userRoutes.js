const { Router } = require("express");
const { UserModel } = require("../models/User.Model");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
require("dotenv").config();
const userRouter = Router();

userRouter.post("/signup", async (req, res) => {
  const { name, email, password, age } = req.body;

  const prev_User = await UserModel.findOne({ email });
  if (prev_User) {
    return res.send("email already in use");
  }
  const hashed_password = bcrypt.hashSync(password, 5);

  try {
    const new_User = new UserModel({
      name,
      email,
      password: hashed_password,
      age,
    });

    await new_User.save();
    res.send("signup successful");
  } catch (err) {
    console.log(err);
  }
});

userRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await UserModel.findOne({ email });
  
  if (user) {
    const hased_password = user.password;
    const result = bcrypt.compareSync(password, hased_password);
    if (result) {
      var token = jwt.sign({ userID: user._id }, process.env.SECRET);
      res.send({ msg: user.name, token });
    } else {
      res.send("incorrect password");
    }
  } else {
    res.send("invalid email");
  }
});

module.exports = { userRouter };
