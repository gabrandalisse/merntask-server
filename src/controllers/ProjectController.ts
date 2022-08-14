import mongoose from "mongoose";
import { Response } from "express";
import Project from "../entities/Project";
import { ProjectRequest } from "../types/requests";
import { validationResult } from "express-validator";
import  ProjectRepository  from "../repositories/ProjectRepository";
import { AuthErrors, FilterType, ProjectErrors, ProjectSuccess } from "../types/enums";

export default class ProjectController {
  private _project_repository: ProjectRepository;

  constructor() {
    this._project_repository = new ProjectRepository();
  }

  public createProject = async (req: ProjectRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { name } = req.body;
      const { id: ownerID } = req.user;

      const project = new Project(name, ownerID);
      await this._project_repository.create(project);

      res.json(project);
    } catch (error) {
      console.log(error);
      res.status(500).json({
        msg: "there was an error where triying to create the project",
      });
    }
  };

  public getProjects = async (req: ProjectRequest, res: Response) => {
    try {
      const projects = await this._project_repository.find(
        req.user.id,
        FilterType.OWNER
      );

      res.json({ projects });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        msg: "there was an error where triying to get all the projects",
      });
    }
  };

  public updateProject = async (req: ProjectRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const projectID = new mongoose.Types.ObjectId(req.params.id);

      let project = await this._project_repository.findOne(projectID, FilterType.ID);
      if (!project)
        return res.status(404).json({ msg: ProjectErrors.NOT_FOUND });

      if (project.owner?.toString() !== req.user.id.toString())
        return res.status(401).json({ msg: AuthErrors.USER_NOT_AUTHORIZED });

      const { name } = req.body;
      const newProject = new Project(name, project.owner);
      project = await this._project_repository.update(projectID, newProject);

      res.json({ project });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        msg: "there was an error where triying to update the project",
      });
    }
  };

  public deleteProject = async (req: ProjectRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const projectID = new mongoose.Types.ObjectId(req.params.id);

      let project = await this._project_repository.findOne(projectID, FilterType.ID);
      if (!project)
        return res.status(404).json({ msg: ProjectErrors.NOT_FOUND });

      if (project.owner?.toString() !== req.user.id.toString())
        return res.status(401).json({ msg: AuthErrors.USER_NOT_AUTHORIZED });

      await this._project_repository.delete(projectID);

      res.json({ msg: ProjectSuccess.DELETED });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        msg: "there was an error where triying to delete the project",
      });
    }
  };
}
