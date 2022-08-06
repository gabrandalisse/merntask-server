interface IUser {
  name: string;
  email: string;
  password: string;
  registration: Date;
}

interface ITask {
  name: string;
  state: boolean;
  created?: Date;
  project?: import('mongoose').Types.ObjectId;
}

interface IProject {
  name: string;
  owner?: import('mongoose').Types.ObjectId;
  created?: Date;
}