interface IUser {
  name: string;
  email: string;
  password: string;
  registration: Date;
}

interface ITask {
  name: string;
  state: boolean;
  created: Date;
  project: import("mongoose").Types.ObjectId;
}

interface IProject {
  name: string;
  owner: import("mongoose").Types.ObjectId;
  created: Date;
}

interface IRead<T> {
  find(
    item: string | import("mongoose").Types.ObjectId,
    filter: import("./enums").FilterType
  ): Promise<T[]>;
  findOne(
    id: string | import("mongoose").Types.ObjectId,
    filter: import("./enums").FilterType
  ): Promise<T>;
}

interface IWrite<T> {
  create(item: T): Promise<string>;
  update(id: import("mongoose").Types.ObjectId, item: T): Promise<T>;
  delete(id: import("mongoose").Types.ObjectId): Promise<void>;
}
