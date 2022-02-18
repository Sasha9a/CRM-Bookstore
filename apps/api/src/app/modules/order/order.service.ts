import { BaseService } from "@crm/api/core/services/base.service";
import { Order } from "@crm/shared/schemas/order.schema";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

/** Сервис выполняющие операции с БД заказами */
@Injectable()
export class OrderService extends BaseService<Order> {

  public constructor(@InjectModel(Order.name) private readonly orderModel: Model<Order>) {
    super(orderModel);
  }

}
