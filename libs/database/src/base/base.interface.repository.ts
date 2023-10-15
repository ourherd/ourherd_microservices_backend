import { DeepPartial, FindManyOptions, FindOneOptions } from 'typeorm';

export interface BaseInterfaceRepository<T> {
  create(data: DeepPartial<T>): T[];
  createMany(data: DeepPartial<T>[]): T[];
  save(data: DeepPartial<T>): Promise<(DeepPartial<T> & T)[]>;
  saveMany(data: DeepPartial<T>[]): Promise<T[]>;
  findByCondition(filterCondition: FindOneOptions<T>): Promise<T>;
  findAll(options?: FindManyOptions<T>): Promise<T[]>;
  remove(data: T): Promise<T[]>;
  softRemove(data: T): Promise<(DeepPartial<T> & T)[]>;
  findWithRelations(relations: FindManyOptions<T>): Promise<T[]>;
  preload(entityLike: DeepPartial<T>): Promise<T>;
}
