import { IRead } from "../interfaces/IRead";
import { IWrite } from "../interfaces/IWrite";
import mongoose, { Collection, ObjectId } from "mongoose";

// TODO delete models? And use entities insthead? 

export default abstract class BaseRepository<T> implements IWrite<T>, IRead<T> {
  // TODO make this private? 
  public readonly _collection: Collection;

  constructor(collectionName: string) {
    this._collection = mongoose.connection.collection(collectionName);
  }

  public async create(item: T): Promise<string> {
    const result = await this._collection.insertOne(item);
    return result.insertedId.toString();
  }

  // TODO check any result, param id must be string | ObjectID
  public async update(id: any, item: T): Promise<T> {
    const result = await this._collection.findOneAndUpdate(
      { _id: id },
      { $set: item as any },
      { returnDocument: "after" }
    );

    return result.value as any;
  }

  // TODO i think that id must be only ObjectId as the others
  public async delete(id: any): Promise<void> {
    await this._collection.findOneAndDelete({_id: id});
  }

  // TODO check the return type any
  public async find(item: any, filter: string): Promise<T[]> {
    const result = await this._collection
      .find({ [filter]: item })
      .sort({ created: -1 })
      .toArray();

    return result as any;
  }

  // TODO fix the result as any and param id any must be string | ObjectId
  public async findOne(id: any, filter: string): Promise<T> {
    const result = await this._collection.findOne({ [filter]: id });
    return result as any;
  }
}
