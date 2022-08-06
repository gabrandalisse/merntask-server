import auth from "../middleware/auth";
import express, { Router } from "express";
import { check } from "express-validator";
import * as ProjectController from "../controllers/project-controller";

const router: Router = express.Router();

router.post(
  "/",
  auth,
  [check("name", "the name of the project is required").not().isEmpty()],
  ProjectController.createProject
);

router.get("/", auth, ProjectController.getProjects);

router.put(
  "/:id",
  auth,
  [check("name", "the name of the project is required").not().isEmpty()],
  ProjectController.updateProject
);

router.delete("/:id", auth, ProjectController.deleteProject);

export default router;
