import { Types } from "mongoose";
import { FilterType } from "../../types/enums";

export interface IRead<T> {
  find(item: string | Types.ObjectId, filter: FilterType): Promise<T[]>;
  findOne(id: string | Types.ObjectId, filter: FilterType): Promise<T>;
}
