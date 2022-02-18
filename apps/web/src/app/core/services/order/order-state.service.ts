import { Injectable } from '@angular/core';
import { OrderDto } from "@crm/shared/dtos/order/order.dto";
import { BaseStateService } from "@crm/web/core/services/base-state.service";
import { OrderService } from "@crm/web/core/services/order/order.service";
import { Observable } from "rxjs";

/** Сервис для запросов по заказам в API */
@Injectable({
  providedIn: 'root'
})
export class OrderStateService extends BaseStateService {

  public constructor(private readonly orderService: OrderService) {
    super();
    this.baseService = orderService;
  }

  /**
   * Get-запрос на получение последних заказов по конкретному товару
   * @param productId ID товара
   * @return Возвращает массив заказов
   */
  public getAllByProduct(productId: string): Observable<OrderDto[]> {
    return this.orderService.getAllByProduct(productId);
  }

}
