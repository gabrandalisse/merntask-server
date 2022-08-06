import auth from "../middleware/auth";
import express, { Router } from "express";
import { check } from "express-validator";
import * as TaskController from "../controllers/task-controller";

const router: Router = express.Router();

router.post(
  "/",
  auth,
  [
    check("name", "the name is required").not().isEmpty(),
    check("project", "the project is required").not().isEmpty(),
  ],
  TaskController.createTask
);

router.get("/", auth, TaskController.getTasks);

router.put("/:id", auth, TaskController.updateTask);

router.delete("/:id", auth, TaskController.deleteTask);

export default router;
