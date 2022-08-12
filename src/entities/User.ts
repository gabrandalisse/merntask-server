import { Types } from "mongoose";

export default class User implements IUser {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  registration: Date;

  constructor(
    name: string,
    email: string,
    pwd: string,
    registration = Date.now()
  ) {
    this.name = name;
    this.email = email;
    this.password = pwd;
    this.registration = new Date(registration);
  }
}
