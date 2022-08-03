import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { Response } from "express";
import User from "../models/Users";

// TODO check any type in req
export async function authenticateUser(req: any, res: Response) {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "the user do not exists" });

    const storedPass = await bcryptjs.compare(password, user.password);
    if (!storedPass)
      return res.status(400).json({ msg: "the password is incorrect" });

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
      { expiresIn: 3600 },
      (error, token) => {
        if (error) throw error;
        res.json({ token });
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "there was an error where triying to authenticate the user",
    });
  }
}

export async function authenticatedUser(req: any, res: Response) {
  try {
    const user = await User.findById(req.usuario.id).select("-password");
    res.json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "there was an error where triying to get the authenticated user",
    });
  }
}
