const express = require("express");
const auth = require("../middleware/auth");
const { check } = require("express-validator");
const TaskController = require("../controllers/task-controller");

const router = express.Router();

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

module.exports = router;
