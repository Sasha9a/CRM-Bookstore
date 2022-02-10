import { Injectable } from "@nestjs/common";
import { FilterQuery, Model } from "mongoose";

/** Сервис выполняющие операции с БД сущности */
@Injectable()
export class BaseService<T> {

  public constructor(private readonly model: Model<T>) {
  }

  /** Функция создает сущность в базу данных
   * @param entity данные о сущности
   * @return Возвращает объект сущности */
  public async create(entity: any): Promise<T> {
    const createEntity = await new this.model(entity);
    return await createEntity.save() as T;
  }

  /** Функция ищет всех сущностей в БД
   * @param filter Фильтры
   * @param projection проекция данных
   * @return Возвращает массив сущностей */
  public async findAll(filter?: FilterQuery<T>, projection?: any): Promise<T[]> {
    return await this.model.find(filter, projection).exec();
  }

  /** Функция ищет сущность в БД по ID
   * @param id ID сущности
   * @param projection проекция данных
   * @return Возвращает объект сущности */
  public async findById(id: string, projection?: any): Promise<T> {
    return await this.model.findById(id, projection).exec();
  }

  /** Функция обновляет данные у сущности в БД
   * @param id ID сущности
   * @param entity новые данные сущности
   * @return Возвращает объект сущности */
  public async update(id: string, entity: any): Promise<T> {
    return await this.model.findOneAndUpdate({ _id: id }, { $set: entity }, { new: true }).exec();
  }

  /** Функция удаляет сущность из БД
   * @param id ID сущности
   * @return Возвращает объект сущности */
  public async delete(id: string): Promise<T> {
    return await this.model.findByIdAndDelete(id).exec();
  }

}
