import mongoose from "mongoose";
import Project from "../entities/Project";
import { CollectionType } from "../types/enums";
import BaseRepository from "./base/BaseRepository";

export default class ProjectRepository extends BaseRepository<Project> {
  constructor() {
    super();
    this._collection = mongoose.connection.collection(CollectionType.PROJECTS);
  }
}
