import User from "../entities/User";
import BaseRepository from "./base/BaseRepository";

export class UserRepository extends BaseRepository<User> {
  delete(id: any): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
