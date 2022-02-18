import { Injectable } from '@angular/core';
import { BaseStateService } from "@crm/web/core/services/base-state.service";
import { OrderService } from "@crm/web/core/services/order/order.service";

/** Сервис для запросов по заказам в API */
@Injectable({
  providedIn: 'root'
})
export class OrderStateService extends BaseStateService {

  public constructor(private readonly orderService: OrderService) {
    super();
    this.baseService = orderService;
  }

}
