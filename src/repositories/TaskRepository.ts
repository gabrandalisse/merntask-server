import mongoose from "mongoose";
import Task from "../entities/Task";
import { CollectionType } from "../types/enums";
import BaseRepository from "./base/BaseRepository";

export default class TaskRepository extends BaseRepository<Task> {
  constructor() {
    super();
    this._collection = mongoose.connection.collection(CollectionType.TASKS);
  }
}
