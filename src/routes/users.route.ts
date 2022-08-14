import express, { Router } from "express";
import { check } from "express-validator";
import UserController from "../controllers/UserController";

const router: Router = express.Router();
const controller: UserController = new UserController();

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
  controller.createUser
);

export default router;
