import express, { Router } from "express";
import UtilController from "../controllers/UtilController";

const router: Router = express.Router();
const controller: UtilController = new UtilController();

router.post("/health-check", controller.healthCheck);

export default router;
