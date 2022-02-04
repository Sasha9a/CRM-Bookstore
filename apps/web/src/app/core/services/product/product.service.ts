import { Injectable } from '@angular/core';
import { BaseService } from "@crm/web/core/services/base.service";

/** Сервис для запросов по товарам в API */
@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseService {

  /** URL товара в API */
  protected override baseUrl = '/product';

}
