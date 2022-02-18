import { Injectable } from '@angular/core';
import { BaseService } from "@crm/web/core/services/base.service";

/** Сервис для запросов по заказам в API */
@Injectable({
  providedIn: 'root'
})
export class OrderService extends BaseService {

  /** URL заказов в API */
  protected override baseUrl = '/order';

}
