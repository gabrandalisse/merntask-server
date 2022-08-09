import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import User from "../models/User";
import { Response } from "express";
import { UserErrors } from "../types/enums";
import { UserRequest } from "../types/requests";
import { validationResult } from "express-validator";

export async function createUser(req: UserRequest, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: UserErrors.ALREADY_EXISTS });

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
      process.env.JWT_SECRET!,
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
}
