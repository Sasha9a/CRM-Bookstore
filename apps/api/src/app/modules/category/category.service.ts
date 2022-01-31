import { BaseService } from "@crm/api/core/services/base.service";
import { Category } from "@crm/shared/schemas/category.schema";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

/** Сервис выполняющие операции с БД категории */
@Injectable()
export class CategoryService extends BaseService<Category> {

  public constructor(@InjectModel(Category.name) private readonly categoryModel: Model<Category>) {
    super(categoryModel);
  }

  
}
