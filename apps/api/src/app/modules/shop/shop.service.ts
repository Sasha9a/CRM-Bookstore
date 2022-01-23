import { BaseService } from "@crm/api/core/services/base.service";
import { Shop } from "@crm/shared/schemas/shop.schema";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

/** Сервис выполняющие операции с БД магазина */
@Injectable()
export class ShopService extends BaseService<Shop> {

  public constructor(@InjectModel(Shop.name) private readonly shopModel: Model<Shop>) {
    super(shopModel);
  }

}
