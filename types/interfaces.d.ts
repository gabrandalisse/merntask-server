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
  project: any;
}

interface IProject {
  name: string;
  owner: any;
  created: Date;
}