import express, { Router } from "express";
import auth from "../middleware/auth";
import * as AuthController from "../controllers/auth-controller";

const router: Router = express.Router();

router.post("/", AuthController.authenticateUser);
router.get("/", auth, AuthController.authenticatedUser);

export default router;
