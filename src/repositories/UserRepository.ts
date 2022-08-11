import User from "../entities/User";
import BaseRepository from "./base/BaseRepository";

export class UserRepository extends BaseRepository<User> {
  delete(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
}
