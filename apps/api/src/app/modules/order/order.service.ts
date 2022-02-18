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

  /** Получить последние данные заказов по конкретному товару
   * @param productId ID сотрудника
   * @param shopId ID магазина
   * @param limit Сколько данных нужно получить
   * @return Массив данных о заказах */
  public getAllByProduct(productId: string, shopId: string, limit = 10): Promise<Order[]> {
    if (shopId) {
      return this.orderModel.find({ 'shop._id': shopId, products: { $elemMatch: { _id: productId } } }).sort({ date: -1 }).limit(limit).exec();
    } else {
      return this.orderModel.find({ products: { $elemMatch: { _id: productId } } }).sort({ date: -1 }).limit(limit).exec();
    }
  }

}
