import { Component, OnInit } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { ActivatedRoute } from "@angular/router";
import { SalaryDto } from "@crm/shared/dtos/salary/salary.dto";
import { SalaryInfoDto } from "@crm/shared/dtos/salary/salary.info.dto";
import { CrmTableColumn } from "@crm/web/core/models/crm-table-column";
import { ErrorService } from "@crm/web/core/services/error.service";
import { SalaryStateService } from "@crm/web/core/services/salary/salary-state.service";
import * as moment from 'moment-timezone';

/** Компонент карточки данных о зарплате */
@Component({
  selector: 'crm-salary-card',
  templateUrl: './salary-card.component.html',
  styleUrls: []
})
export class SalaryCardComponent implements OnInit {

  /** Данные зарплаты */
  public salary: SalaryDto;

  /** Идет загрузка или нет */
  public loading = true;

  /** Столбцы таблицы */
  public itemColumns: CrmTableColumn[] = [
    { label: 'ФИО', name: 'name', sort: 'user.name:string', style: { 'min-width.rem': 15 } },
    { label: 'Оклад', name: 'salary', sort: 'user.salary:number' },
    { label: 'Всего рабочих дней', name: 'daysWorkedAll', sort: 'daysWorkedAll:number', style: { 'max-width.px': 120 } },
    { label: 'Отработанные дни', name: 'daysWorked', sort: 'daysWorked:number', style: { 'max-width.px': 120 } },
    { label: 'Больничный', name: 'sickPay', sort: 'sickPay:number' },
    { label: 'Отпускные', name: 'vacationPay', sort: 'vacationPay:number' },
    { label: 'Зарплата', name: 'sumEmployee', sort: 'sumEmployee:number' },
    { label: 'Налоги работодателя', name: 'sumTaxes', sort: 'sumTaxes:number' },
    { label: 'Премия' },
    { label: 'Штраф' },
    { label: 'Болезнь (дней)' },
    { label: 'Отпуск (дней)' },
    { label: 'Описание' }
  ];

  public constructor(private readonly salaryStateService: SalaryStateService,
                     private readonly route: ActivatedRoute,
                     private readonly errorService: ErrorService,
                     private readonly title: Title) { }

  public ngOnInit(): void {
    const salaryId = this.route.snapshot.params['id'];

    if (!salaryId) {
      return this.errorService.addCustomError('Ошибка', 'Произошла ошибка, вернитесь на главную и попробуйте снова.');
    }

    this.salaryStateService.findById<SalaryDto>(salaryId).subscribe((salary) => {
      this.salary = salary;
      this.title.setTitle(`Расчетный лист за ${moment(this.salary.date).format('DD.MM.YYYY')} - CRM`);
      this.loading = false;
    }, () => this.loading = false);
  }

  /** Функция типизирует переменную
   * @param info информация
   * @return возвращает информацию */
  public toInfo(info: any): SalaryInfoDto {
    return info as SalaryInfoDto;
  }

}
