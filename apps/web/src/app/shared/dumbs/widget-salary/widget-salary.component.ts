import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SalaryDto } from "@crm/shared/dtos/salary/salary.dto";
import { CrmTableColumn } from "@crm/web/core/models/crm-table-column";
import * as moment from "moment-timezone";

/** Компонент показаза краткой сводки по рачетным листам */
@Component({
  selector: 'crm-widget-salary',
  templateUrl: './widget-salary.component.html',
  styleUrls: []
})
export class WidgetSalaryComponent {

  /** Расчетные листы */
  @Input() public payslip: SalaryDto[];

  /** Грузится ли или нет */
  @Input() public loading = false;

  /** Фильтр периода дат */
  public datePeriod = {
    from: moment().startOf('month').toDate(),
    to: moment().endOf('month').toDate()
  };

  /** Событие вызывается когда период выбран */
  @Output() public selectRangeDate = new EventEmitter<[Date, Date]>();

  /** Столбцы таблицы */
  public itemColumns: CrmTableColumn[] = [
    { label: 'День выдачи', name: 'date', sort: 'date:date' },
    { label: 'Период' },
    { label: 'Магазин', name: 'shop', sort: 'shop.address:string' },
    { label: 'Итого', name: 'sum', sort: 'sum:number' },
    { label: 'Общее описание' }
  ];

  /** Функция типизирует переменную
   * @param payslip данные о зарплате
   * @return возвращает данные */
  public toPayslip(payslip: any): SalaryDto {
    return payslip as SalaryDto;
  }

}
