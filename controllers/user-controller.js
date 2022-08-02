const jwt = require("jsonwebtoken");
const bcryptjs = require("bcryptjs");
const User = require("../models/Users");
const { validationResult } = require("express-validator");

exports.createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "the user already exists" });

    user = new User(req.body);

    // Hash pass
    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(password, salt);

    await user.save();

    // Create the JWT
    const payload = {
      user: {
        id: user.id,
      },
    };

    // Sign the JWT
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      {
        expiresIn: 3600,
      },
      (error, token) => {
        if (error) throw error;
        res.json({ token });
      }
    );
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "there was an error where triying to create the user",
    });
  }
};
