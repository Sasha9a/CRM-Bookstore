import { DecimalPipe } from "@angular/common";
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ShopDto } from "@crm/shared/dtos/shop/shop.dto";
import { TrafficReportDto } from "@crm/shared/dtos/traffic/report/traffic.report.dto";
import { TrafficReportItemDto } from "@crm/shared/dtos/traffic/report/traffic.report.item.dto";
import { TrafficReportQueryParamsDto } from "@crm/shared/dtos/traffic/report/traffic.report.query.params.dto";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { ChartGroupPeriodEnum } from "@crm/web/core/models/chart-group-period.enum";
import { CrmTableColumn } from "@crm/web/core/models/crm-table-column";
import { AuthService } from "@crm/web/core/services/user/auth.service";
import * as moment from "moment-timezone";
import { UIChart } from "primeng/chart";

/** Компонент отчета по трафику */
@Component({
  selector: 'crm-widget-traffic',
  templateUrl: './widget-traffic.component.html',
  styleUrls: []
})
export class WidgetTrafficComponent implements OnInit, OnChanges {

  /** Данные трафика */
  @Input() public traffic: TrafficReportDto;

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
    { label: 'Магазин', name: 'shop', sort: 'shop.shop.address:string' },
    { label: 'Кол-во чеков', name: 'countReceipt', sort: 'countReceipt:number' },
    { label: 'Зашли', name: 'in', sort: 'shop.in:number' },
    { label: 'Прошли мимо', name: 'notcome', sort: 'shop.notcome:number' },
    { label: 'Конверсия, вход', name: 'entrance', sort: 'shop.entrance:number' },
    { label: 'Конверсия, чеки', name: 'conversionReceipt', sort: 'conversionReceipt:number' }
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

  public constructor(private readonly authService: AuthService,
                     public readonly decimalPipe: DecimalPipe) { }

  public ngOnInit(): void {
    if (!this.authService.checkRoles([RoleEnum.GENERAL_MANAGER]) &&
      this.authService.checkRoles([RoleEnum.STORE_DIRECTOR]) &&
      this.authService.currentUser.shop) {
      this.isDirector = true;
      this.filters.shop = this.authService.currentUser.shop?._id;
      this.selectedFilters.shop = this.authService.currentUser.shop;
    }
  }

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['traffic']?.currentValue) {
      this.updateChart();
    }
  }

  /** Функция обновляет график */
  public updateChart() {
    this.chartData = {
      labels: Object.keys(this.traffic.sums[this.activeGroupPeriod])
        .map((key) => {
          if (this.activeGroupPeriod === ChartGroupPeriodEnum.days) {
            return moment(key, 'YYYY-MM-DD').format('DD.MM.YYYY');
          } else if (this.activeGroupPeriod === ChartGroupPeriodEnum.weeks) {
            return `${moment(key, 'YYYY-WW').startOf('week').format('DD.MM.YYYY')} - ${moment(key, 'YYYY-WW').endOf('week').format('DD.MM.YYYY')}`;
          } else if (this.activeGroupPeriod === ChartGroupPeriodEnum.months) {
            return moment(key, 'YYYY-MM').format('MMMM YYYY');
          }
          return '';
        }),
      datasets: [
        {
          label: 'Кол-во чеков',
          backgroundColor: 'rgba(70, 255, 63, 0.5)',
          data: Object.values(this.traffic.sums[this.activeGroupPeriod]).map((value) => value['receipt'])
        },
        {
          label: 'Зашли',
          backgroundColor: 'rgba(72,116,255,0.5)',
          data: Object.values(this.traffic.sums[this.activeGroupPeriod]).map((value) => value['in'])
        },
        {
          label: 'Прошли мимо',
          backgroundColor: 'rgba(255,125,125,0.5)',
          data: Object.values(this.traffic.sums[this.activeGroupPeriod]).map((value) => value['notcome'])
        }
      ]
    };
    this.chart?.refresh();
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
   * @param traffic данные трафика
   * @return возвращает данные трафика */
  public toTraffic(traffic: any): TrafficReportItemDto {
    return traffic as TrafficReportItemDto;
  }

}
