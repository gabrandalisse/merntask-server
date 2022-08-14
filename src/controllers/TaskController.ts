import mongoose from "mongoose";
import { Response } from "express";
import Task from "../entities/Task";
import { TaskRequest } from "../types/requests";
import { validationResult } from "express-validator";
import TaskRepository from "../repositories/TaskRepository";
import ProjectRepository from "../repositories/ProjectRepository";
import {
  AuthErrors,
  FilterType,
  ProjectErrors,
  TaskErrors,
  TaskSuccess,
} from "../types/enums";

export default class TaskController {
  private _project_repository: ProjectRepository;
  private _task_repository: TaskRepository;

  constructor() {
    this._project_repository = new ProjectRepository();
    this._task_repository = new TaskRepository();
  }

  public createTask = async (req: TaskRequest, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { project } = req.body;
      const projectID = new mongoose.Types.ObjectId(project);

      const storedProject = await this._project_repository.findOne(
        projectID,
        FilterType.ID
      );
      if (!storedProject)
        return res.status(404).json({ msg: ProjectErrors.NOT_FOUND });

      if (storedProject.owner?.toString() !== req.user.id.toString())
        return res.status(401).json({ msg: AuthErrors.USER_NOT_AUTHORIZED });

      const { name } = req.body;
      const task = new Task(name, projectID);
      await this._task_repository.create(task);

      res.json({ task });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        msg: "there was an error where triying to create the task",
      });
    }
  };

  public getTasks = async (req: TaskRequest, res: Response) => {
    try {
      const { project } = req.query;
      const projectID = new mongoose.Types.ObjectId(project?.toString());

      const storedProject = await this._project_repository.findOne(
        projectID,
        FilterType.ID
      );
      if (!storedProject)
        return res.status(404).json({ msg: ProjectErrors.NOT_FOUND });

      if (storedProject.owner?.toString() !== req.user.id.toString())
        return res.status(401).json({ msg: AuthErrors.USER_NOT_AUTHORIZED });

      const tasks = await this._task_repository.find(
        projectID,
        FilterType.PROJECT
      );
      res.json({ tasks });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        msg: "there was an error where triying to get the tasks",
      });
    }
  };

  public updateTask = async (req: TaskRequest, res: Response) => {
    try {
      const taskID = new mongoose.Types.ObjectId(req.params.id);

      let task = await this._task_repository.findOne(taskID, FilterType.ID);
      if (!task) return res.status(404).json({ msg: TaskErrors.NOT_FOUND });

      const { project } = req.body;
      const projectID = new mongoose.Types.ObjectId(project);

      const storedProject = await this._project_repository.findOne(
        projectID,
        FilterType.ID
      );
      if (storedProject?.owner?.toString() !== req.user.id.toString())
        return res.status(401).json({ msg: AuthErrors.USER_NOT_AUTHORIZED });

      const { name, state } = req.body;
      const newTask = new Task(name, projectID, state);

      task = await this._task_repository.update(taskID, newTask);

      res.json({ task });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        msg: "there was an error where triying to update the task",
      });
    }
  };

  public deleteTask = async (req: TaskRequest, res: Response) => {
    try {
      const taskID = new mongoose.Types.ObjectId(req.params.id);

      let task = await this._task_repository.findOne(taskID, FilterType.ID);
      if (!task) return res.status(404).json({ msg: TaskErrors.NOT_FOUND });

      const { project } = req.query;
      const projectID = new mongoose.Types.ObjectId(project?.toString());

      const storedProject = await this._project_repository.findOne(
        projectID,
        FilterType.ID
      );
      if (storedProject?.owner?.toString() !== req.user.id.toString())
        return res.status(401).json({ msg: AuthErrors.USER_NOT_AUTHORIZED });

      await this._task_repository.delete(taskID);
      res.json({ msg: TaskSuccess.DELETED });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        msg: "there was an error where triying to delete the task",
      });
    }
  };
}
