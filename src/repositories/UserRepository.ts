import mongoose from "mongoose";
import User from "../entities/User";
import { CollectionType } from "../types/enums";
import BaseRepository from "./base/BaseRepository";

export default class UserRepository extends BaseRepository<User> {
  constructor() {
    super();
    this._collection = mongoose.connection.collection(CollectionType.USERS);
  }

  delete(id: any): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
