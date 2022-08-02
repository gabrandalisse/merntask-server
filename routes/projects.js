const express = require("express");
const auth = require("../middleware/auth");
const { check } = require("express-validator");
const ProjectController = require("../controllers/project-controller");

const router = express.Router();

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

module.exports = router;
