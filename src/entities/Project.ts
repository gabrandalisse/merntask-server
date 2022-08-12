import { Types } from "mongoose";

export default class Project implements IProject {
  _id?: Types.ObjectId;
  name: string;
  owner: Types.ObjectId;
  created: Date;

  constructor(name: string, owner: Types.ObjectId, created = Date.now()) {
    this.name = name;
    this.owner = owner;
    this.created = new Date(created);
  }
}
