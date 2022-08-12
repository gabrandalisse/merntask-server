import auth from "../middleware/auth";
import express, { Router } from "express";
import { check } from "express-validator";
import ProjectController from "../controllers/ProjectController";

const router: Router = express.Router();
const controller: ProjectController = new ProjectController();

router.post(
  "/",
  auth,
  [check("name", "the name of the project is required").not().isEmpty()],
  controller.createProject
);

router.get("/", auth, controller.getProjects);

router.put(
  "/:id",
  auth,
  [check("name", "the name of the project is required").not().isEmpty()],
  controller.updateProject
);

router.delete("/:id", auth, controller.deleteProject);

export default router;
