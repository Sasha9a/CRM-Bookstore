import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { OrderDto } from "@crm/shared/dtos/order/order.dto";
import { ShopDto } from "@crm/shared/dtos/shop/shop.dto";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { CrmTableColumn } from "@crm/web/core/models/crm-table-column";
import { AuthService } from "@crm/web/core/services/user/auth.service";
import * as moment from "moment-timezone";

/** Компонент показаза краткой сводки по заказам */
@Component({
  selector: 'crm-widget-order',
  templateUrl: './widget-order.component.html',
  styleUrls: []
})
export class WidgetOrderComponent implements OnInit {

  /** Заказы */
  @Input() public orders: OrderDto[];

  /** Магазины */
  @Input() public shops: ShopDto[];

  /** Грузится ли или нет */
  @Input() public loading = false;

  /** Фильтры */
  public filters = {
    from: moment().startOf('month').toDate(),
    to: moment().endOf('month').toDate(),
    shop: undefined
  };

  /** Событие вызывается когда меняются фильтры */
  @Output() public changeQueryParams = new EventEmitter<any>();

  /** Столбцы таблицы */
  public itemColumns: CrmTableColumn[] = [
    { label: 'День оформления', name: 'date', sort: 'date:date' },
    { label: 'Магазин', name: 'shop', sort: 'shop.address:string' },
    { label: 'Сумма', name: 'sum', sort: 'sum:number' }
  ];

  /** Директор ли смотрит виджет или нет */
  public isDirector = false;

  public constructor(private readonly authService: AuthService) { }

  public ngOnInit(): void {
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
   * @param order заказ
   * @return возвращает заказ */
  public toOrder(order: any): OrderDto {
    return order as OrderDto;
  }

}
