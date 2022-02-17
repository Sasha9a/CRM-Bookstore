import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReceiptDto } from "@crm/shared/dtos/receipt/receipt.dto";
import { CrmTableColumn } from "@crm/web/core/models/crm-table-column";
import * as moment from "moment-timezone";

@Component({
  selector: 'crm-widget-receipt',
  templateUrl: './widget-receipt.component.html',
  styleUrls: []
})
export class WidgetReceiptComponent {

  /** Чеки */
  @Input() public receipts: ReceiptDto[];

  /** Грузится ли или нет */
  @Input() public loading = false;

  /** Фильтр периода дат */
  public datePeriod = {
    from: moment().startOf('month').toDate(),
    to: moment().endOf('month').toDate()
  };

  /** Событие вызывается когда период выбран */
  @Output() public selectRangeDate = new EventEmitter<[Date, Date]>();

  /** Столбцы таблицы */
  public itemColumns: CrmTableColumn[] = [
    { label: 'День выдачи', name: 'date', sort: 'date:date' },
    { label: 'Магазин', name: 'shop', sort: 'shop.address:string' },
    { label: 'Способ оплаты', name: 'paymentMethod', sort: 'paymentMethod:string' },
    { label: 'Наличными', name: 'amountCash', sort: 'amountCash:number' },
    { label: 'Безналичными', name: 'amountCashless', sort: 'amountCashless:number' }
  ];

  /** Функция типизирует переменную
   * @param receipt чек
   * @return возвращает чек */
  public toReceipt(receipt: any): ReceiptDto {
    return receipt as ReceiptDto;
  }

}
