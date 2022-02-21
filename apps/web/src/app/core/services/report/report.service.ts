import { Injectable } from '@angular/core';
import { BaseService } from "@crm/web/core/services/base.service";

/** Сервис для запросов по отчетам в API */
@Injectable({
  providedIn: 'root'
})
export class ReportService extends BaseService {

  /** URL отчетов в API */
  protected override baseUrl = '/report';

}
