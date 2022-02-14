import { Component, OnInit } from '@angular/core';
import { SalaryDto } from "@crm/shared/dtos/salary/salary.dto";
import { SalaryStateService } from "@crm/web/core/services/salary/salary-state.service";

/** Компонент рабочего стола */
@Component({
  selector: 'crm-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: []
})
export class DashboardComponent implements OnInit {

  /** Расчетные листы */
  public payslip: SalaryDto[];

  /** Грузится ли таблица расчетных листов или нет */
  public payslipLoading = true;

  public constructor(private readonly salaryStateService: SalaryStateService) {
  }

  public ngOnInit(): void {
    this.salaryStateService.find<SalaryDto>().subscribe((payslip) => {
      this.payslip = payslip;
      this.payslipLoading = false;
    }, () => this.payslipLoading = false);
  }

}
