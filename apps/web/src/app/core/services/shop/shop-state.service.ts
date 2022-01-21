import { Injectable } from '@angular/core';
import { BaseStateService } from "@crm/web/core/services/base-state.service";
import { ShopService } from "@crm/web/core/services/shop/shop.service";

/** Сервис для запросов по пользователю в API */
@Injectable({
  providedIn: 'root'
})
export class ShopStateService extends BaseStateService {

  public constructor(private readonly shopService: ShopService) {
    super();
    this.baseService = shopService;
  }

}
