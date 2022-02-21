import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MoneyTurnoverDto } from "@crm/shared/dtos/report/money-turnover/money.turnover.dto";
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
    plugins: {
      legend: {
        labels: {
          color: '#495057'
        }
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#495057'
        },
        grid: {
          color: '#ebedef'
        }
      },
      y: {
        ticks: {
          color: '#495057'
        },
        grid: {
          color: '#ebedef'
        }
      }
    }
  };

  /** Активная группировка */
  public activeGroupPeriod = ChartGroupPeriodEnum.days;

  @ViewChild('chart') public chart: UIChart;

  public get Object() {
    return Object;
  }

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

  public ngOnChanges(changes: SimpleChanges) {
    if (changes['report']?.currentValue) {
      this.updateChart();
    }
  }

  /** Функция обновляет график */
  public updateChart() {
    this.chartData = {
      labels: Object.keys(this.report.sums[this.activeGroupPeriod])
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
          label: 'Доходы',
          backgroundColor: 'rgba(70, 255, 63, 0.5)',
          data: Object.values(this.report.sums[this.activeGroupPeriod]).map((value) => value['income'])
        },
        {
          label: 'Расходы',
          backgroundColor: 'rgba(255,72,72,0.5)',
          data: Object.values(this.report.sums[this.activeGroupPeriod]).map((value) => value['expenses'])
        }
      ]
    };
    this.chart?.refresh();

    this.itemColumns = [
      { label: 'Статьи' }
    ];
    this.itemColumns.push(
      Object.keys(this.report.sums[this.activeGroupPeriod])
        .map((key) => {
          let date;
          if (this.activeGroupPeriod === ChartGroupPeriodEnum.days) {
            date = moment(key, 'YYYY-MM-DD').format('DD.MM.YYYY');
          } else if (this.activeGroupPeriod === ChartGroupPeriodEnum.weeks) {
            date = `${moment(key, 'YYYY-WW').startOf('week').format('DD.MM.YYYY')} - ${moment(key, 'YYYY-WW').endOf('week').format('DD.MM.YYYY')}`;
          } else if (this.activeGroupPeriod === ChartGroupPeriodEnum.months) {
            date = moment(key, 'YYYY-MM').format('MMMM YYYY');
          }
          return {
            label: date
          };
        })
    );
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

}
