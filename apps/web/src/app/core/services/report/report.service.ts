import { Injectable } from '@angular/core';
import { MoneyTurnoverDto } from "@crm/shared/dtos/report/money-turnover/money.turnover.dto";
import { MoneyTurnoverQueryParamsDto } from "@crm/shared/dtos/report/money-turnover/money.turnover.query.params.dto";
import { TurnoverAnalyticsDto } from "@crm/shared/dtos/report/turnover-analytics/turnover.analytics.dto";
import { TurnoverAnalyticsQueryParamsDto } from "@crm/shared/dtos/report/turnover-analytics/turnover.analytics.query.params.dto";
import { BaseService } from "@crm/web/core/services/base.service";
import { Observable } from "rxjs";

/** Сервис для запросов по отчетам в API */
@Injectable({
  providedIn: 'root'
})
export class ReportService extends BaseService {

  /** URL отчетов в API */
  protected override baseUrl = '/report';

  /** Get-запрос на получение данных о денежном обороте
   * @param queryParams параметры от клиента
   * @return Возвращает данные о денежном обороте */
  public moneyTurnover(queryParams: MoneyTurnoverQueryParamsDto): Observable<MoneyTurnoverDto> {
    return this.http.get<MoneyTurnoverDto>(`${this.baseUrl}/money-turnover`, { params: this.getParams(queryParams) });
  }

  /** Get-запрос на получение данных аналитики товарооборота
   * @param queryParams параметры от клиента
   * @return Возвращает данные аналитики товарооборота */
  public turnoverAnalytics(queryParams: TurnoverAnalyticsQueryParamsDto): Observable<TurnoverAnalyticsDto> {
    return this.http.get<TurnoverAnalyticsDto>(`${this.baseUrl}/turnover-analytics`, { params: this.getParams(queryParams) });
  }

}
