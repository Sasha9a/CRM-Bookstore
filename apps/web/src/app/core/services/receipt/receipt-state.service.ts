import { Injectable } from '@angular/core';
import { BaseStateService } from "@crm/web/core/services/base-state.service";
import { ReceiptService } from "@crm/web/core/services/receipt/receipt.service";

/** Сервис для запросов по чекам в API */
@Injectable({
  providedIn: 'root'
})
export class ReceiptStateService extends BaseStateService {

  public constructor(private readonly receiptService: ReceiptService) {
    super();
    this.baseService = receiptService;
  }

}
