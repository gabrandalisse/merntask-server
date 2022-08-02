const express = require("express");
const auth = require("../middleware/auth");
const AuthController = require("../controllers/auth-controller");

const router = express.Router();

router.post("/", AuthController.authenticateUser);
router.get("/", auth, AuthController.authenticatedUser);

module.exports = router;
