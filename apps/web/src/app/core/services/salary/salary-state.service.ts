import { Injectable } from '@angular/core';
import { SalaryDto } from "@crm/shared/dtos/salary/salary.dto";
import { BaseStateService } from "@crm/web/core/services/base-state.service";
import { SalaryService } from "@crm/web/core/services/salary/salary.service";
import { Observable } from "rxjs";

/** Сервис для запросов по зарплатам в API */
@Injectable({
  providedIn: 'root'
})
export class SalaryStateService extends BaseStateService {

  public constructor(private readonly salaryService: SalaryService) {
    super();
    this.baseService = salaryService;
  }

  /**
   * Get-запрос на получение последних актов о зарплатах по конкретному сотруднику
   * @param userId ID сотрудника
   * @return Возвращает массив актов */
  public getAllByUser(userId: string): Observable<SalaryDto[]> {
    return this.salaryService.getAllByUser(userId);
  }

}
