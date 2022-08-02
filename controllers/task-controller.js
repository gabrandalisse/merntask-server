const Task = require("../models/Task");
const Project = require("../models/Project");
const { validationResult } = require("express-validator");

exports.createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { project } = req.body;

    const storedProject = await Project.findById(project);
    if (!storedProject)
      return res.status(404).json({ msg: "project not found" });

    if (storedProject.owner.toString() !== req.user.id)
      return res.status(401).json({ msg: "the user is not authorized" });

    const task = new Task(req.body);
    await task.save();

    res.json({ task });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "there was an error where triying to create the task",
    });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { project } = req.query;

    const storedProject = await Project.findById(proyecto);
    if (!storedProject)
      return res.status(404).json({ msg: "project not found" });

    if (storedProject.owner.toString() !== req.user.id)
      return res.status(401).json({ msg: "the user is not authorized" });

    const tasks = await Task.find({ project });
    res.json({ tasks });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "there was an error where triying to get the tasks",
    });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { project, name, state } = req.body;

    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: "task not found" });

    const storedProject = await Project.findById(project);
    if (storedProject.owner.toString() !== req.user.id)
      return res.status(401).json({ msg: "the user is not authorized" });

    const newTask = {};
    newTask.name = name;
    newTask.state = state;

    task = await Task.findOneAndUpdate({ _id: req.params.id }, newtask, {
      new: true,
    });

    res.json({ task });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "there was an error where triying to update the task",
    });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { project } = req.query;

    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: "task not found" });

    const storedProject = await Project.findById(project);
    if (storedProject.owner.toString() !== req.user.id)
      return res.status(401).json({ msg: "the user is not authorized" });

    await Task.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: "task was deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "there was an error where triying to delete the task",
    });
  }
};
