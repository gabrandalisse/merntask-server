// import Task from "../models/Task";
// import Project from "../models/Project";
import { Response } from "express";
import { TaskRequest } from "../types/requests";
import { validationResult } from "express-validator";
import {
  AuthErrors,
  ProjectErrors,
  TaskErrors,
  TaskSuccess,
} from "../types/enums";
import mongoose from "mongoose";
import Task from '../entities/Task';

import { ProjectRepository } from "../repositories/ProjectRepository";
import { TaskRepository } from "../repositories/TaskRepository";

export async function createTask(req: TaskRequest, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    // TODO make that the own repo knows is collection
    const projectRepository = new ProjectRepository('projects');
    const taskRepository = new TaskRepository('tasks');

    const { name, project } = req.body;
    const projectID = new mongoose.Types.ObjectId(project);

    const storedProject = await projectRepository.findOne(projectID, '_id');
    if (!storedProject)
      return res.status(404).json({ msg: ProjectErrors.NOT_FOUND });

    if (storedProject.owner?.toString() !== req.user.id.toString())
      return res.status(401).json({ msg: AuthErrors.USER_NOT_AUTHORIZED });

    const task = new Task(name, projectID);
    await taskRepository.create(task);

    res.json({ task });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "there was an error where triying to create the task",
    });
  }
}

export async function getTasks(req: TaskRequest, res: Response) {
  try {
    const projectRepository = new ProjectRepository('projects');
    const taskRepository = new TaskRepository('tasks');

    const { project } = req.query;
    const projectID = new mongoose.Types.ObjectId(project?.toString());

    const storedProject = await projectRepository.findOne(projectID, '_id');
    if (!storedProject)
      return res.status(404).json({ msg: ProjectErrors.NOT_FOUND });

    if (storedProject.owner?.toString() !== req.user.id.toString())
      return res.status(401).json({ msg: AuthErrors.USER_NOT_AUTHORIZED });

    const tasks = await taskRepository.find(projectID, 'project');
    res.json({ tasks });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "there was an error where triying to get the tasks",
    });
  }
 }

 export async function updateTask(req: TaskRequest, res: Response) {
  try {
    const projectRepository = new ProjectRepository('projects');
    const taskRepository = new TaskRepository('tasks');

    const { project, name, state } = req.body;

    const taskID = new mongoose.Types.ObjectId(req.params.id);

    let task = await taskRepository.findOne(taskID, '_id');
    if (!task) return res.status(404).json({ msg: TaskErrors.NOT_FOUND });

    const projectID = new mongoose.Types.ObjectId(project);

    const storedProject = await projectRepository.findOne(projectID, '_id');
    if (storedProject?.owner?.toString() !== req.user.id.toString())
      return res.status(401).json({ msg: AuthErrors.USER_NOT_AUTHORIZED });

    const newTask = new Task(name, projectID, state);

    task = await taskRepository.update(taskID, newTask);

    res.json({ task });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "there was an error where triying to update the task",
    });
  }
 }

 export async function deleteTask(req: TaskRequest, res: Response) {
  try {
    const projectRepository = new ProjectRepository('projects');
    const taskRepository = new TaskRepository('tasks');

    const { project } = req.query;
  
    const taskID = new mongoose.Types.ObjectId(req.params.id);


    let task = await taskRepository.findOne(taskID, '_id');
    if (!task) return res.status(404).json({ msg: TaskErrors.NOT_FOUND });

    const projectID = new mongoose.Types.ObjectId(project?.toString());

    const storedProject = await projectRepository.findOne(projectID, '_id');
    if (storedProject?.owner?.toString() !== req.user.id.toString())
      return res.status(401).json({ msg: AuthErrors.USER_NOT_AUTHORIZED });

    await taskRepository.delete(taskID);
    res.json({ msg: TaskSuccess.DELETED });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "there was an error where triying to delete the task",
    });
  }
 }
