import Task from "../models/Task";
import { Response } from "express";
import Project from "../models/Project";
import { TaskRequest } from "../types/requests";
import { validationResult } from "express-validator";


export async function createTask(req: TaskRequest, res: Response) {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { project } = req.body;

    const storedProject = await Project.findById(project);
    if (!storedProject)
      return res.status(404).json({ msg: "project not found" });

    if (storedProject.owner?.toString() !== req.user.id.toString())
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
}

export async function getTasks(req: TaskRequest, res: Response) {
  try {
    const { project } = req.query;

    const storedProject = await Project.findById(project);
    if (!storedProject)
      return res.status(404).json({ msg: "project not found" });

    if (storedProject.owner?.toString() !== req.user.id.toString())
      return res.status(401).json({ msg: "the user is not authorized" });

    const tasks = await Task.find({ project });
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
    const { project, name, state } = req.body;

    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: "task not found" });

    const storedProject = await Project.findById(project);
    if (storedProject?.owner?.toString() !== req.user.id.toString())
      return res.status(401).json({ msg: "the user is not authorized" });

    const newTask: ITask = {
      name,
      state: state!,
    };

    task = await Task.findOneAndUpdate({ _id: req.params.id }, newTask, {
      new: true,
    });

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
    const { project } = req.query;

    let task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ msg: "task not found" });

    const storedProject = await Project.findById(project);
    if (storedProject?.owner?.toString() !== req.user.id.toString())
      return res.status(401).json({ msg: "the user is not authorized" });

    await Task.findOneAndRemove({ _id: req.params.id });
    res.json({ msg: "task was deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "there was an error where triying to delete the task",
    });
  }
}
