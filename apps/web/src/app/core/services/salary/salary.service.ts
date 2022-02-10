import { Injectable } from '@angular/core';
import { SalaryDto } from "@crm/shared/dtos/salary/salary.dto";
import { BaseService } from "@crm/web/core/services/base.service";
import { Observable } from "rxjs";

/** Сервис для запросов по зарплатам в API */
@Injectable({
  providedIn: 'root'
})
export class SalaryService extends BaseService {

  /** URL зарплат в API */
  protected override baseUrl = '/salary';

  /**
   * Get-запрос на получение последних актов о зарплатах по конкретному сотруднику
   * @param userId ID сотрудника
   * @return Возвращает массив актов
   */
  public getAllByUser(userId: string): Observable<SalaryDto[]> {
    return this.http.get<SalaryDto[]>(`${this.baseUrl}/user/${userId}`);
  }

}
