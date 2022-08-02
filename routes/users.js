const express = require("express");
const { check } = require("express-validator");
const UserController = require("../controllers/user-controller");

const router = express.Router();

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

module.exports = router;
