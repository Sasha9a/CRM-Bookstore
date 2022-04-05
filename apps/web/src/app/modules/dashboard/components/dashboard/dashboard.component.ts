import { Component, OnInit } from '@angular/core';
import { OrderDto } from "@crm/shared/dtos/order/order.dto";
import { ReceiptDto } from "@crm/shared/dtos/receipt/receipt.dto";
import { MoneyTurnoverDto } from "@crm/shared/dtos/report/money-turnover/money.turnover.dto";
import { MoneyTurnoverQueryParamsDto } from "@crm/shared/dtos/report/money-turnover/money.turnover.query.params.dto";
import { TurnoverAnalyticsDto } from "@crm/shared/dtos/report/turnover-analytics/turnover.analytics.dto";
import { TurnoverAnalyticsQueryParamsDto } from "@crm/shared/dtos/report/turnover-analytics/turnover.analytics.query.params.dto";
import { SalaryDto } from "@crm/shared/dtos/salary/salary.dto";
import { ShopDto } from "@crm/shared/dtos/shop/shop.dto";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { OrderStateService } from "@crm/web/core/services/order/order-state.service";
import { ReceiptStateService } from "@crm/web/core/services/receipt/receipt-state.service";
import { ReportStateService } from "@crm/web/core/services/report/report-state.service";
import { SalaryStateService } from "@crm/web/core/services/salary/salary-state.service";
import { ShopStateService } from "@crm/web/core/services/shop/shop-state.service";
import { TrafficStateService } from "@crm/web/core/services/traffic/traffic-state.service";
import { AuthService } from "@crm/web/core/services/user/auth.service";
import * as moment from "moment-timezone";

/** Компонент рабочего стола */
@Component({
  selector: 'crm-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: []
})
export class DashboardComponent implements OnInit {

  /** Расчетные листы */
  public payslip: SalaryDto[];

  /** Чеки */
  public receipts: ReceiptDto[];

  /** Заказы */
  public orders: OrderDto[];

  // /** Трафик */
  // public traffics: TrafficReportDto;

  /** Денежный оборот */
  public moneyTurnover: MoneyTurnoverDto;

  /** Аналитика товарооборота */
  public turnoverAnalytics: TurnoverAnalyticsDto;

  /** Магазины */
  public shops: ShopDto[];

  /** Грузится ли таблица расчетных листов или нет */
  public payslipLoading = true;

  /** Грузится ли таблица чеков или нет */
  public receiptsLoading = true;

  /** Грузится ли таблица заказов или нет */
  public ordersLoading = true;

  /** Грузится ли трафик или нет */
  public trafficsLoading = true;

  /** Грузится ли Денежный оборот или нет */
  public moneyTurnoverLoading = true;

  /** Грузится ли Аналитика товарооборота или нет */
  public turnoverAnalyticsLoading = true;

  public get RoleEnum() {
    return RoleEnum;
  }

  public constructor(private readonly salaryStateService: SalaryStateService,
                     private readonly shopStateService: ShopStateService,
                     private readonly receiptStateService: ReceiptStateService,
                     private readonly ordersStateService: OrderStateService,
                     private readonly trafficStateService: TrafficStateService,
                     private readonly reportStateService: ReportStateService,
                     public readonly authService: AuthService) {
  }

  public ngOnInit(): void {
    const datePeriod: { from: Date, to: Date } = {
      from: moment().startOf('month').toDate(),
      to: moment().endOf('month').toDate()
    };

    if (this.authService.checkRoles([RoleEnum.GENERAL_MANAGER])) {
      this.loadPayslip(datePeriod);
    }

    if (this.authService.checkRoles([RoleEnum.GENERAL_MANAGER, RoleEnum.STORE_DIRECTOR])) {
      let selectShop: ShopDto = undefined;
      if (!this.authService.checkRoles([RoleEnum.GENERAL_MANAGER]) &&
        this.authService.checkRoles([RoleEnum.STORE_DIRECTOR]) &&
        this.authService.currentUser.shop) {
        selectShop = this.authService.currentUser.shop;
      }
      this.loadReceipts({ ...datePeriod, ...{ shop: selectShop } });
      this.loadOrders({ ...datePeriod, ...{ shop: selectShop } });
      // this.loadTraffic({
      //   from: moment(datePeriod.from).format('YYYY-MM-DD') as unknown as Date,
      //   to: moment(datePeriod.to).format('YYYY-MM-DD') as unknown as Date,
      //   shop: selectShop?._id || undefined
      // });
      this.loadMoneyTurnover({
        from: moment(datePeriod.from).format('YYYY-MM-DD') as unknown as Date,
        to: moment(datePeriod.to).format('YYYY-MM-DD') as unknown as Date,
        shop: selectShop?._id || undefined
      });
      this.loadTurnoverAnalytics({
        from: moment(datePeriod.from).format('YYYY-MM-DD') as unknown as Date,
        to: moment(datePeriod.to).format('YYYY-MM-DD') as unknown as Date,
        shop: selectShop?._id || undefined
      });
    }

    this.shopStateService.find<ShopDto>().subscribe((shops) => this.shops = shops);
  }

  /** Функция загружает данные о расчетных счетах
   * @param queryParams параметры фильтрации */
  public loadPayslip(queryParams?: { from: Date, to: Date }) {
    this.payslipLoading = true;

    let params;
    if (queryParams) {
      params = {
        date: {
          $gte: moment(queryParams.from).toISOString(),
          $lte: moment(queryParams.to).toISOString()
        }
      };
      params = {
        filter: JSON.stringify(params)
      }
    }

    this.salaryStateService.find<SalaryDto>(params).subscribe((payslip) => {
      this.payslip = payslip;
      this.payslipLoading = false;
    }, () => this.payslipLoading = false);
  }

  /** Функция загружает данные о чеках
   * @param queryParams параметры фильтрации */
  public loadReceipts(queryParams?: { from: Date, to: Date, shop: ShopDto }) {
    this.receiptsLoading = true;

    let params;
    if (queryParams) {
      params = {
        date: {
          $gte: moment(queryParams.from).toISOString(),
          $lte: moment(queryParams.to).toISOString()
        }
      };
      if (queryParams.shop) {
        params['shop._id'] = queryParams.shop?._id;
      }
      params = {
        filter: JSON.stringify(params)
      }
    }

    this.receiptStateService.find<ReceiptDto>(params).subscribe((receipts) => {
      this.receipts = receipts;
      this.receiptsLoading = false;
    }, () => this.receiptsLoading = false);
  }

  /** Функция загружает данные о заказах
   * @param queryParams параметры фильтрации */
  public loadOrders(queryParams?: { from: Date, to: Date, shop: ShopDto }) {
    this.ordersLoading = true;

    let params;
    if (queryParams) {
      params = {
        date: {
          $gte: moment(queryParams.from).toISOString(),
          $lte: moment(queryParams.to).toISOString()
        }
      };
      if (queryParams.shop) {
        params['shop._id'] = queryParams.shop?._id;
      }
      params = {
        filter: JSON.stringify(params)
      }
    }

    this.ordersStateService.find<OrderDto>(params).subscribe((orders) => {
      this.orders = orders;
      this.ordersLoading = false;
    }, () => this.ordersLoading = false);
  }

  // /** Функция загружает данные о трафике
  //  * @param queryParams параметры фильтрации */
  // public loadTraffic(queryParams: TrafficReportQueryParamsDto) {
  //   this.trafficsLoading = true;
  //
  //   this.trafficStateService.report(queryParams).subscribe((data) => {
  //     this.traffics = data;
  //     this.trafficsLoading = false;
  //   }, () => this.trafficsLoading = false);
  // }

  /** Функция загружает данные о денежном обороте
   * @param queryParams параметры фильтрации */
  public loadMoneyTurnover(queryParams: MoneyTurnoverQueryParamsDto) {
    this.moneyTurnoverLoading = true;

    this.reportStateService.moneyTurnover(queryParams).subscribe((data) => {
      this.moneyTurnover = data;
      this.moneyTurnoverLoading = false;
    }, () => this.moneyTurnoverLoading = false);
  }

  /** Функция загружает данные аналитики товарооборота
   * @param queryParams параметры фильтрации */
  public loadTurnoverAnalytics(queryParams: TurnoverAnalyticsQueryParamsDto) {
    this.turnoverAnalyticsLoading = true;

    this.reportStateService.turnoverAnalytics(queryParams).subscribe((data) => {
      this.turnoverAnalytics = data;
      this.turnoverAnalyticsLoading = false;
    }, () => this.turnoverAnalyticsLoading = false);
  }

}
