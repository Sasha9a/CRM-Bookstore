import { Injectable } from '@angular/core';
import { TrafficReportDto } from "@crm/shared/dtos/traffic/report/traffic.report.dto";
import { TrafficReportQueryParamsDto } from "@crm/shared/dtos/traffic/report/traffic.report.query.params.dto";
import { BaseStateService } from "@crm/web/core/services/base-state.service";
import { TrafficService } from "@crm/web/core/services/traffic/traffic.service";
import { Observable } from "rxjs";

/** Сервис для запросов по трафику в API */
@Injectable({
  providedIn: 'root'
})
export class TrafficStateService extends BaseStateService {

  public constructor(private readonly trafficService: TrafficService) {
    super();
    this.baseService = trafficService;
  }

  /** Get-запрос на получение списка всех данных о трафике
   * @param queryParams параметры от клиента
   * @return Возвращает массив данных о трафике */
  public report(queryParams: TrafficReportQueryParamsDto): Observable<TrafficReportDto> {
    return this.trafficService.report(queryParams);
  }

}
