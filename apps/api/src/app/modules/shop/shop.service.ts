import { ShopFormDto } from "@crm/shared/dtos/shop/shop.form.dto";
import { Shop } from "@crm/shared/schemas/shop.schema";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

/** Сервис выполняющие операции с БД магазина */
@Injectable()
export class ShopService {

  public constructor(@InjectModel(Shop.name) private readonly shopModel: Model<Shop>) {
  }

  /** Функция создает магазин в базу данных
   * @param shop данные о магазине
   * @return Возвращает объект магазина */
  public async create(shop: ShopFormDto): Promise<Shop> {
    const createShop = await new this.shopModel(shop);
    return createShop.save();
  }

  /** Функция ищет всех магазинов в БД
   * @return Возвращает массив магазинов */
  public async findAll(): Promise<Shop[]> {
    return await this.shopModel.find().exec();
  }

  /** Функция ищет магазин в БД по ID
   * @param id ID магазина
   * @return Возвращает объект магазина */
  public async findById(id: string): Promise<Shop> {
    return await this.shopModel.findById(id).exec();
  }

  /** Функция обновляет данные у магазина в БД
   * @param id ID магазина
   * @param shop новые данные магазина
   * @return Возвращает объект магазина */
  public async update(id: string, shop: ShopFormDto): Promise<Shop> {
    return await this.shopModel.findOneAndUpdate({ _id: id }, { $set: shop }, { new: true }).exec();
  }

  /** Функция удаляет магазин из БД
   * @param id ID магазина
   * @return Возвращает объект магазина */
  public async delete(id: string): Promise<Shop> {
    return await this.shopModel.findByIdAndDelete(id).exec();
  }

}
