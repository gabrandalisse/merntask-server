import { Request } from "express";
import { Types } from "mongoose";

export interface UserRequest extends Request {
  body: IUser;
}

export interface ProjectRequest extends Request {
  body: {
    name: string;
  };
}

export interface TaskRequest extends Request {
  body: {
    name: string;
    project: string;
    state?: boolean;
  }
}

export interface AuthRequest extends Request {
  body: {
    email: string;
    password: string;
  }
}