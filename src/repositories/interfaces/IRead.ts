import { ObjectId } from "mongoose";

export interface IRead<T> {
  // todo check the filter in the find 
  find(item: any, filter: any): Promise<T[]>;
  findOne(id: any , filter: string): Promise<T>;
}
