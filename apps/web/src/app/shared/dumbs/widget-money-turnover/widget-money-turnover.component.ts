import { Component, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild } from '@angular/core';
import { MoneyTurnoverDto } from "@crm/shared/dtos/report/money-turnover/money.turnover.dto";
import { MoneyTurnoverItemDto } from "@crm/shared/dtos/report/money-turnover/money.turnover.item.dto";
import { MoneyTurnoverQueryParamsDto } from "@crm/shared/dtos/report/money-turnover/money.turnover.query.params.dto";
import { ShopDto } from "@crm/shared/dtos/shop/shop.dto";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { ChartGroupPeriodEnum } from "@crm/web/core/models/chart-group-period.enum";
import { CrmTableColumn } from "@crm/web/core/models/crm-table-column";
import { AuthService } from "@crm/web/core/services/user/auth.service";
import * as moment from "moment-timezone";
import { UIChart } from "primeng/chart";

/** Компонент отчета по денежному обороту */
@Component({
  selector: 'crm-widget-money-turnover',
  templateUrl: './widget-money-turnover.component.html',
  styleUrls: []
})
export class WidgetMoneyTurnoverComponent implements OnInit, OnChanges {

  /** Данные денежного оборота */
  @Input() public report: MoneyTurnoverDto;

  /** Магазины */
  @Input() public shops: ShopDto[];

  /** Грузится ли или нет */
  @Input() public loading = false;

  /** Фильтры */
  public filters: MoneyTurnoverQueryParamsDto = {
    from: moment().startOf('month').format('YYYY-MM-DD') as unknown as Date,
    to: moment().endOf('month').format('YYYY-MM-DD') as unknown as Date,
    shop: undefined
  };

  /** Выбранные фильтры */
  public selectedFilters: { shop: ShopDto } = {
    shop: undefined
  }

  /** Событие вызывается когда меняются фильтры */
  @Output() public changeQueryParams = new EventEmitter<MoneyTurnoverQueryParamsDto>();

  /** Столбцы таблицы */
  public itemColumns: CrmTableColumn[] = [
    { label: 'Статьи' }
  ];

  /** Директор ли смотрит виджет или нет */
  public isDirector = false;

  /** Данные графики */
  public chartData: any;

  /** Настройки графики */
  public chartOptions = {
    tooltips: {
      mode: 'index',
      intersect: false
    },
    responsive: true,
    scales: {
      x: {
        stacked: true
      },
      y: {
        stacked: true
      }
    }
  };

  /** Активная группировка */
  public activeGroupPeriod = ChartGroupPeriodEnum.days;

  @ViewChild('chart') public chart: UIChart;

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
   * @param item данные денежного оборота
   * @return возвращает данные денежного оборота */
  public toMoneyTurnover(item: any): MoneyTurnoverItemDto {
    return item as MoneyTurnoverItemDto;
  }

}
