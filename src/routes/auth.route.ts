import express, { Router } from "express";
import auth from "../middleware/auth";
import  AuthController from "../controllers/AuthController";

const router: Router = express.Router();
const controller: AuthController = new AuthController();

router.post("/", controller.authenticateUser);
router.get("/", auth, controller.authenticatedUser);

export default router;
