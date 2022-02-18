import { Injectable } from '@angular/core';
import { OrderDto } from "@crm/shared/dtos/order/order.dto";
import { BaseService } from "@crm/web/core/services/base.service";
import { Observable } from "rxjs";

/** Сервис для запросов по заказам в API */
@Injectable({
  providedIn: 'root'
})
export class OrderService extends BaseService {

  /** URL заказов в API */
  protected override baseUrl = '/order';

  /**
   * Get-запрос на получение последних заказов по конкретному товару
   * @param productId ID товара
   * @return Возвращает массив заказов
   */
  public getAllByProduct(productId: string): Observable<OrderDto[]> {
    return this.http.get<OrderDto[]>(`${this.baseUrl}/product/${productId}`);
  }

}
