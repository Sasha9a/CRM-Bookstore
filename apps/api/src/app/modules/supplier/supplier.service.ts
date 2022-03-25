import { BaseService } from "@crm/api/core/services/base.service";
import { Supplier } from "@crm/shared/schemas/supplier.schema";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

/** Сервис выполняющие операции с БД поставщика */
@Injectable()
export class SupplierService extends BaseService<Supplier> {

  public constructor(@InjectModel(Supplier.name) private readonly supplierModel: Model<Supplier>) {
    super(supplierModel);
  }

}
