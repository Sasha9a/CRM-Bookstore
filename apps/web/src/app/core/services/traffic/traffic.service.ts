import { Injectable } from '@angular/core';
import { TrafficReportDto } from "@crm/shared/dtos/traffic/report/traffic.report.dto";
import { TrafficReportQueryParamsDto } from "@crm/shared/dtos/traffic/report/traffic.report.query.params.dto";
import { BaseService } from "@crm/web/core/services/base.service";
import { Observable } from "rxjs";

/** Сервис для запросов по трафику в API */
@Injectable({
  providedIn: 'root'
})
export class TrafficService extends BaseService {

  /** URL трафика в API */
  protected override baseUrl = '/traffic';

  /** Get-запрос на получение списка всех данных о трафике
   * @param queryParams параметры от клиента
   * @return Возвращает массив данных о трафике */
  public report(queryParams: TrafficReportQueryParamsDto): Observable<TrafficReportDto> {
    return this.http.get<TrafficReportDto>(this.baseUrl, { params: this.getParams(queryParams) });
  }

}
