export interface IWrite<T> {
  create(item: T): Promise<string>;
  update(id: any, item: T): Promise<T>;
  delete(id: string): Promise<void>;
}
