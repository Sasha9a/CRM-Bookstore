import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ReceiptDto } from "@crm/shared/dtos/receipt/receipt.dto";
import { ShopDto } from "@crm/shared/dtos/shop/shop.dto";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { CrmTableColumn } from "@crm/web/core/models/crm-table-column";
import { AuthService } from "@crm/web/core/services/user/auth.service";
import * as moment from "moment-timezone";

@Component({
  selector: 'crm-widget-receipt',
  templateUrl: './widget-receipt.component.html',
  styleUrls: []
})
export class WidgetReceiptComponent implements OnInit {

  /** Чеки */
  @Input() public receipts: ReceiptDto[];

  /** Магазины */
  @Input() public shops: ShopDto[];

  /** Грузится ли или нет */
  @Input() public loading = false;

  /** Фильтр периода дат */
  public filters = {
    from: moment().startOf('month').toDate(),
    to: moment().endOf('month').toDate(),
    shop: undefined
  };

  /** Событие вызывается меняются фильтры */
  @Output() public changeQueryParams = new EventEmitter<any>();

  /** Столбцы таблицы */
  public itemColumns: CrmTableColumn[] = [
    { label: 'День выдачи', name: 'date', sort: 'date:date' },
    { label: 'Магазин', name: 'shop', sort: 'shop.address:string' },
    { label: 'Способ оплаты', name: 'paymentMethod', sort: 'paymentMethod:string' },
    { label: 'Наличными', name: 'amountCash', sort: 'amountCash:number' },
    { label: 'Безналичными', name: 'amountCashless', sort: 'amountCashless:number' }
  ];

  /** Директор ли смотрит виджет или нет */
  public isDirector = false;

  public constructor(private readonly authService: AuthService) {
  }

  public ngOnInit() {
    if (!this.authService.checkRoles([RoleEnum.GENERAL_MANAGER]) &&
      this.authService.checkRoles([RoleEnum.STORE_DIRECTOR]) &&
      this.authService.currentUser.shop) {
      this.isDirector = true;
      this.filters.shop = this.authService.currentUser.shop;
    }
  }

  /** Сохраняет даты в фильтры
   * @param dates Даты */
  public setDateFilter(dates: [Date, Date]) {
    this.filters.from = dates[0];
    this.filters.to = dates[1];
    this.changeQueryParams.emit(this.filters);
  }

  /** Функция типизирует переменную
   * @param receipt чек
   * @return возвращает чек */
  public toReceipt(receipt: any): ReceiptDto {
    return receipt as ReceiptDto;
  }

}
