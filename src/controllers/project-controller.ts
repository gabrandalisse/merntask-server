import { Response } from "express";
import { ProjectRequest } from "../types/requests";
import { validationResult } from "express-validator";
import { ProjectErrors, ProjectSuccess, AuthErrors } from "../types/enums";

import { ProjectRepository } from "../repositories/ProjectRepository";
import Project from "../entities/Project";
import mongoose from "mongoose";

export async function createProject(req: ProjectRequest, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const repository = new ProjectRepository("projects");

    const { name } = req.body;
    const { id: ownerID } = req.user;

    const project = new Project(name, ownerID);
    await repository.create(project);

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
    const repository = new ProjectRepository("projects");
    const projects = await repository.find(req.user.id, 'owner');

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

  try {
    const repository = new ProjectRepository("projects");

    const projectID = new mongoose.Types.ObjectId(req.params.id);

    let project = await repository.findOne(projectID, "_id");
    if (!project) return res.status(404).json({ msg: ProjectErrors.NOT_FOUND });

    if (project.owner?.toString() !== req.user.id.toString())
      return res.status(401).json({ msg: AuthErrors.USER_NOT_AUTHORIZED });

    const newProject = new Project(name, project.owner);

    project = await repository.update(projectID, newProject);

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
    const repository = new ProjectRepository("projects");

    const projectID = new mongoose.Types.ObjectId(req.params.id);

    // TODO make an enum with filters
    let project = await repository.findOne(projectID, "_id");
    if (!project) return res.status(404).json({ msg: ProjectErrors.NOT_FOUND });

    if (project.owner?.toString() !== req.user.id.toString())
      return res.status(401).json({ msg: AuthErrors.USER_NOT_AUTHORIZED });

    await repository.delete(projectID);

    res.json({ msg: ProjectSuccess.DELETED });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "there was an error where triying to delete the project",
    });
  }
}
