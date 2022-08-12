import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { Response } from "express";
import User from "../entities/User";
import { FilterType, UserErrors } from "../types/enums";
import { UserRequest } from "../types/requests";
import { validationResult } from "express-validator";
import { UserRepository } from "../repositories/UserRepository";

export default class UserController {
  private _user_repository: UserRepository;

  constructor() {
    this._user_repository = new UserRepository("users");
  }

  public createUser = async (req: UserRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email } = req.body;

    try {
      let user = await this._user_repository.findOne(email, FilterType.EMAIL);
      if (user) return res.status(400).json({ msg: UserErrors.ALREADY_EXISTS });

      const { name, password } = req.body;
      user = new User(name, email, password);

      // Hash pass
      const salt = await bcryptjs.genSalt(10);
      user.password = await bcryptjs.hash(password, salt);

      const newUserID = await this._user_repository.create(user);

      // Create the JWT
      const payload = {
        user: {
          id: newUserID,
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
  };
}
