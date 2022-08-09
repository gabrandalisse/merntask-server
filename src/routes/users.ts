import express, { Router } from "express";
import { check } from "express-validator";
import * as UserController from "../controllers/user-controller";

const router: Router = express.Router();

router.post(
  "/",
  [
    check("name", "the name is required").not().isEmpty(),
    check("email", "the email is required").isEmail(),
    check(
      "password",
      "the password must be at least 6 characters long"
    ).isLength({
      min: 6,
    }),
  ],
  UserController.createUser
);

export default router;
