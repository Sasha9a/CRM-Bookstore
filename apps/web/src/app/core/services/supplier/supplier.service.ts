import { Injectable } from '@angular/core';
import { BaseService } from "@crm/web/core/services/base.service";

/** Сервис для запросов по поставщику в API */
@Injectable({
  providedIn: 'root'
})
export class SupplierService extends BaseService {

  /** URL поставщика в API */
  protected override baseUrl = '/supplier';

}
