const Project = require("../models/Project");
const { validationResult } = require("express-validator");

exports.createProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const project = new Project(req.body);

    project.owner = req.user.id;
    project.save();

    res.json(project);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "there was an error where triying to create the project",
    });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.user.id }).sort({
      created: -1,
    });

    res.json({ projects });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "there was an error where triying to get all the projects",
    });
  }
};

exports.updateProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { name } = req.body;
  const newProject = {};

  newProject.name = name;

  try {
    let project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ msg: "project not found" });

    if (project.owner.toString() !== req.user.id)
      return res.status(401).json({ msg: "the user is not authorized" });

    project = await Project.findByIdAndUpdate(
      { _id: req.params.id },
      { $set: newProject },
      { new: true }
    );

    res.json({ project });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "there was an error where triying to update the project",
    });
  }
};

exports.deleteProject = async (req, res) => {
  const errores = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    let project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: "project not found" });

    if (project.owner.toString() !== req.user.id)
      return res.status(401).json({ msg: "the user is not authorized" });

    await Project.findOneAndRemove({ _id: req.params.id });

    res.json({ msg: "project deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "there was an error where triying to delete the project",
    });
  }
};
