import { Response } from "express";
import Project from "../models/Project";
import { ProjectRequest } from "../types/requests";
import { validationResult } from "express-validator";
import { ProjectErrors, ProjectSuccess, AuthErrors } from "../types/enums";

export async function createProject(req: ProjectRequest, res: Response) {
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
}

export async function getProjects(req: ProjectRequest, res: Response) {
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
}

export async function updateProject(req: ProjectRequest, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { name } = req.body;
  const newProject: IProject = {
    name,
  };

  try {
    let project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: ProjectErrors.NOT_FOUND });

    if (project.owner?.toString() !== req.user.id.toString())
      return res.status(401).json({ msg: AuthErrors.USER_NOT_AUTHORIZED });

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
}

export async function deleteProject(req: ProjectRequest, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    let project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ msg: ProjectErrors.NOT_FOUND });

    if (project.owner?.toString() !== req.user.id.toString())
      return res.status(401).json({ msg: AuthErrors.USER_NOT_AUTHORIZED });

    await Project.findOneAndRemove({ _id: req.params.id });

    res.json({ msg: ProjectSuccess.DELETED });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "there was an error where triying to delete the project",
    });
  }
}
