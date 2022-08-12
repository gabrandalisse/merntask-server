import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import { Response } from "express";
import { AuthRequest } from "../types/requests";
import { AuthErrors, FilterType, UserErrors } from "../types/enums";
import { UserRepository } from "../repositories/UserRepository";

export default class AuthController {
  private _user_repository: UserRepository;

  constructor() {
    this._user_repository = new UserRepository("users");
  }

  public authenticateUser = async (req: AuthRequest, res: Response) => {
    try {
      const { email } = req.body;
      let user = await this._user_repository.findOne(email, FilterType.EMAIL);
      if (!user) return res.status(400).json({ msg: UserErrors.NOT_EXISTS });

      const { password } = req.body;
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
  };

  public authenticatedUser = async (req: AuthRequest, res: Response) => {
    try {
      const userID = new mongoose.Types.ObjectId(req.params.id);
      const user: Partial<IUser> = await this._user_repository.findOne(
        userID,
        FilterType.ID
      );
      delete user.password;

      res.json({ user });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        msg: "there was an error where triying to get the authenticated user",
      });
    }
  };
}
