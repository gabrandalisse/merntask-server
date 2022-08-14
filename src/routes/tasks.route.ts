import auth from "../middleware/auth";
import express, { Router } from "express";
import { check } from "express-validator";
import TaskController from "../controllers/TaskController";

const router: Router = express.Router();
const controller = new TaskController();

router.post(
  "/",
  auth,
  [
    check("name", "the name is required").not().isEmpty(),
    check("project", "the project is required").not().isEmpty(),
  ],
  controller.createTask
);

router.get("/", auth, controller.getTasks);

router.put("/:id", auth, controller.updateTask);

router.delete("/:id", auth, controller.deleteTask);

export default router;
