import { Collection, Types } from "mongoose";
import { FilterType } from "../../types/enums";

export default abstract class BaseRepository<T> implements IWrite<T>, IRead<T> {
  protected _collection!: Collection;

  /**
   * Insert a new item into the collection
   * @param {T} item The item that will be created
   * @returns {String} The id of the inserted item
   */
  public async create(item: T): Promise<string> {
    const result = await this._collection.insertOne(item);
    return result.insertedId.toString();
  }

  /**
   * Update an item from the collection
   * @param {ObjectId} id The id of the item to actualice
   * @param {T} item The new item with the new values to actualice
   * @returns {T} The new updated item
   */
  public async update(id: Types.ObjectId, item: T): Promise<T> {
    const result = await this._collection.findOneAndUpdate(
      { _id: id },
      { $set: item as any },
      { returnDocument: "after" }
    );

    return result.value as any;
  }

  /**
   * Delete an item from the collection
   * @param {ObjectId} id The id of the item to delete
   */
  public async delete(id: Types.ObjectId): Promise<void> {
    await this._collection.findOneAndDelete({ _id: id });
  }

  /**
   * Return all the items of a collection
   * @param {String | ObjectId} id The id field of the items to filter, for example, ObjectId('ahg7sg6f89g')
   * @param {FilterType} filter The name of the object attr to filter, for example, owner
   * @returns {T[]} An array of filtered items
   */
  public async find(
    id: string | Types.ObjectId,
    filter: FilterType
  ): Promise<T[]> {
    const result = await this._collection
      .find({ [filter]: id })
      .sort({ created: -1 })
      .toArray();

    return result as any;
  }

  /**
   * Return a single item of the collection
   * @param {String | ObjectId} id The id field of the item to get, for example, ObjectId('ahg7sg6f89g')
   * @param {FilterType} filter The name of the object attr to filter, for example, _id
   * @returns {T} A item of the collection
   */
  public async findOne(
    id: string | Types.ObjectId,
    filter: FilterType
  ): Promise<T> {
    const result = await this._collection.findOne({ [filter]: id });
    return result as any;
  }
}
