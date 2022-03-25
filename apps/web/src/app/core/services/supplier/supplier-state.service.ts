import { Injectable } from '@angular/core';
import { BaseStateService } from "@crm/web/core/services/base-state.service";
import { SupplierService } from "@crm/web/core/services/supplier/supplier.service";

/** Сервис для запросов по поставщику в API */
@Injectable({
  providedIn: 'root'
})
export class SupplierStateService extends BaseStateService {

  public constructor(private readonly supplierService: SupplierService) {
    super();
    this.baseService = supplierService;
  }

}
