import { Injectable } from '@angular/core';
import { BaseService } from "@crm/web/core/services/base.service";

/** Сервис для запросов по чекам в API */
@Injectable({
  providedIn: 'root'
})
export class ReceiptService extends BaseService {

  /** URL чеков в API */
  protected override baseUrl = '/receipt';

}
