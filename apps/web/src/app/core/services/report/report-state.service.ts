import { Injectable } from '@angular/core';
import { MoneyTurnoverDto } from "@crm/shared/dtos/report/money-turnover/money.turnover.dto";
import { MoneyTurnoverQueryParamsDto } from "@crm/shared/dtos/report/money-turnover/money.turnover.query.params.dto";
import { TurnoverAnalyticsDto } from "@crm/shared/dtos/report/turnover-analytics/turnover.analytics.dto";
import { TurnoverAnalyticsQueryParamsDto } from "@crm/shared/dtos/report/turnover-analytics/turnover.analytics.query.params.dto";
import { BaseStateService } from "@crm/web/core/services/base-state.service";
import { ReportService } from "@crm/web/core/services/report/report.service";
import { Observable } from "rxjs";

/** Сервис для запросов по отчетам в API */
@Injectable({
  providedIn: 'root'
})
export class ReportStateService extends BaseStateService {

  public constructor(private readonly reportService: ReportService) {
    super();
    this.baseService = reportService;
  }

  /** Get-запрос на получение данных о денежном обороте
   * @param queryParams параметры от клиента
   * @return Возвращает данные о денежном обороте */
  public moneyTurnover(queryParams: MoneyTurnoverQueryParamsDto): Observable<MoneyTurnoverDto> {
    return this.reportService.moneyTurnover(queryParams);
  }

  /** Get-запрос на получение данных аналитики товарооборота
   * @param queryParams параметры от клиента
   * @return Возвращает данные аналитики товарооборота */
  public turnoverAnalytics(queryParams: TurnoverAnalyticsQueryParamsDto): Observable<TurnoverAnalyticsDto> {
    return this.reportService.turnoverAnalytics(queryParams);
  }

}
