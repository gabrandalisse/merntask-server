import { Types } from "mongoose";

export default class Project implements IProject {
  // TODO change class attr for _name and so on
  name: string;
  // TODO user string for all the id in the app
  owner: Types.ObjectId;
  created: Date;

  constructor(name: string, owner: Types.ObjectId, created = Date.now()) {
    this.name = name;
    this.owner = owner;
    this.created = new Date(created);
  }
}
