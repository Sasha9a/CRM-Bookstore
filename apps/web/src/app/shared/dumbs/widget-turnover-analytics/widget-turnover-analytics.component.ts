import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TurnoverAnalyticsDto } from "@crm/shared/dtos/report/turnover-analytics/turnover.analytics.dto";
import { TurnoverAnalyticsItemDto } from "@crm/shared/dtos/report/turnover-analytics/turnover.analytics.item.dto";
import { ShopDto } from "@crm/shared/dtos/shop/shop.dto";
import { TrafficReportQueryParamsDto } from "@crm/shared/dtos/traffic/report/traffic.report.query.params.dto";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { CrmTableColumn } from "@crm/web/core/models/crm-table-column";
import { AuthService } from "@crm/web/core/services/user/auth.service";
import * as moment from "moment-timezone";

/** Компонент отчета аналитики товарооборота */
@Component({
  selector: 'crm-widget-turnover-analytics',
  templateUrl: './widget-turnover-analytics.component.html',
  styleUrls: []
})
export class WidgetTurnoverAnalyticsComponent implements OnInit {

  /** Данные аналитики товарооборота */
  @Input() public report: TurnoverAnalyticsDto;

  /** Магазины */
  @Input() public shops: ShopDto[];

  /** Грузится ли или нет */
  @Input() public loading = false;

  /** Фильтры */
  public filters: TrafficReportQueryParamsDto = {
    from: moment().startOf('month').format('YYYY-MM-DD') as unknown as Date,
    to: moment().endOf('month').format('YYYY-MM-DD') as unknown as Date,
    shop: undefined
  };

  /** Выбранные фильтры */
  public selectedFilters: { shop: ShopDto } = {
    shop: undefined
  }

  /** Событие вызывается когда меняются фильтры */
  @Output() public changeQueryParams = new EventEmitter<TrafficReportQueryParamsDto>();

  /** Столбцы таблицы */
  public itemColumns: CrmTableColumn[] = [
    { label: 'Дата', name: 'date', sort: 'date:date' },
    { label: 'Магазин', name: 'shop', sort: 'shop.address:string' },
    { label: 'Кол-во чеков', name: 'countReceipt', sort: 'countReceipt:number' },
    { label: 'Средний чек', name: 'averageCheck', sort: 'averageCheck:number' },
    { label: 'Популярный товар', name: 'popularProduct', sort: 'popularProduct.name:string' },
    { label: 'Популярная категория', name: 'popularCategory', sort: 'popularCategory.name:string' }
  ];

  /** Директор ли смотрит виджет или нет */
  public isDirector = false;

  public constructor(private readonly authService: AuthService) { }

  public ngOnInit(): void {
    if (!this.authService.checkRoles([RoleEnum.GENERAL_MANAGER]) &&
      this.authService.checkRoles([RoleEnum.STORE_DIRECTOR]) &&
      this.authService.currentUser.shop) {
      this.isDirector = true;
      this.filters.shop = this.authService.currentUser.shop?._id;
      this.selectedFilters.shop = this.authService.currentUser.shop;
    }
  }

  /** Сохраняет даты в фильтры
   * @param dates Даты */
  public setDateFilter(dates: [Date, Date]) {
    this.filters.from = moment(dates[0]).format('YYYY-MM-DD') as unknown as Date;
    this.filters.to = moment(dates[1]).format('YYYY-MM-DD') as unknown as Date;
    this.changeQueryParams.emit(this.filters);
  }

  /** Сохраняет магазин в фильтры */
  public setShopFilter() {
    this.filters.shop = this.selectedFilters.shop?._id;
    this.changeQueryParams.emit(this.filters);
  }

  /** Функция типизирует переменную
   * @param data данные
   * @return возвращает данные */
  public toData(data: any): TurnoverAnalyticsItemDto {
    return data as TurnoverAnalyticsItemDto;
  }

}
