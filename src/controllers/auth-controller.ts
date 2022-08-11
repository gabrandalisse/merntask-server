import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
// import User from "../models/User";
import { Response } from "express";
import { AuthRequest } from "../types/requests";
import { AuthErrors, UserErrors } from "../types/enums";

import { UserRepository } from "../repositories/UserRepository";
import mongoose from "mongoose";

export async function authenticateUser(req: AuthRequest, res: Response) {
  const { email, password } = req.body;

  try {
    const userRepository = new UserRepository('users');

    let user = await userRepository.findOne(email, 'email');
    if (!user) return res.status(400).json({ msg: UserErrors.NOT_EXISTS });

    const storedPass = await bcryptjs.compare(password, user.password!);
    if (!storedPass)
      return res.status(400).json({ msg: AuthErrors.INCORRECT_PASSWORD });

    // Create the JWT
    const payload = {
      user: {
        id: user._id,
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

export async function authenticatedUser(req: AuthRequest, res: Response) {
  try {
    const userRepository = new UserRepository('users');
    const userID = new mongoose.Types.ObjectId(req.params.id);

    const user = await userRepository.findOne(userID, '_id');
    delete user["password"];

    res.json({ user });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "there was an error where triying to get the authenticated user",
    });
  }
}
