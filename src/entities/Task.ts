import { Types } from "mongoose";

export default class Task implements ITask {
  name: string;
  state: boolean;
  created: Date;
  project: Types.ObjectId;

  constructor(
    name: string,
    project: Types.ObjectId,
    state = false,
    created = new Date(),
  ) {
    this.name = name;
    this.state = state;
    this.created = created;
    this.project = project;
  }
}
