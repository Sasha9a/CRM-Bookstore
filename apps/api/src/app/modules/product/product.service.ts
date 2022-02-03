import { BaseService } from "@crm/api/core/services/base.service";
import { Product } from "@crm/shared/schemas/product.schema";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

/** Сервис выполняющие операции с БД товаром */
@Injectable()
export class ProductService extends BaseService<Product> {

  public constructor(@InjectModel(Product.name) private readonly productModel: Model<Product>) {
    super(productModel);
  }

}
