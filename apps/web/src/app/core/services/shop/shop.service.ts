import { Injectable } from '@angular/core';
import { BaseService } from "@crm/web/core/services/base.service";

/** Сервис для запросов по магазину в API */
@Injectable({
  providedIn: 'root'
})
export class ShopService extends BaseService {

  /** URL магазина в API */
  protected override baseUrl = '/shop';

}
