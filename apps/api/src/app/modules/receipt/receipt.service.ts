import { BaseService } from "@crm/api/core/services/base.service";
import { Receipt } from "@crm/shared/schemas/receipt.schema";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

/** Сервис выполняющие операции с БД чеками */
@Injectable()
export class ReceiptService extends BaseService<Receipt> {

  public constructor(@InjectModel(Receipt.name) private readonly receiptModel: Model<Receipt>) {
    super(receiptModel);
  }

}
