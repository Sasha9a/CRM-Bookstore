import { Injectable } from '@angular/core';
import { BaseStateService } from "@crm/web/core/services/base-state.service";
import { ReportService } from "@crm/web/core/services/report/report.service";

/** Сервис для запросов по отчетам в API */
@Injectable({
  providedIn: 'root'
})
export class ReportStateService extends BaseStateService {

  public constructor(private readonly reportService: ReportService) {
    super();
    this.baseService = reportService;
  }

}
