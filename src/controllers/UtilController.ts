import mongoose from "mongoose";
import Project from "../entities/Project";
import { Response, Request } from "express";
import ProjectRepository from "../repositories/ProjectRepository";

export default class UtilController {
  private _project_repository: ProjectRepository;

  constructor() {
    this._project_repository = new ProjectRepository();
  }

  public healthCheck = async (req: Request, res: Response) => {
    try {
        const healtCheckOwnerID = new mongoose.Types.ObjectId('health-check');

        const project = new Project('Health Check Project', healtCheckOwnerID);
        const strProjectID = await this._project_repository.create(project);

        console.log('PROJECT', strProjectID);

        const objProjectID = new mongoose.Types.ObjectId(strProjectID);
        await this._project_repository.delete(objProjectID);

        res.status(200).send('ok');
    } catch (error) {
      console.log(error);
      res.status(500).json({
        msg: "there was an error where triying to check the health of the project",
      });
    }
  };
}
