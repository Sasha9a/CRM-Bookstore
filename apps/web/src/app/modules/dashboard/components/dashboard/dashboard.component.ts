import { Component, OnInit } from '@angular/core';
import { SalaryDto } from "@crm/shared/dtos/salary/salary.dto";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { SalaryStateService } from "@crm/web/core/services/salary/salary-state.service";
import { AuthService } from "@crm/web/core/services/user/auth.service";

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

  public get RoleEnum() {
    return RoleEnum;
  }

  public constructor(private readonly salaryStateService: SalaryStateService,
                     public readonly authService: AuthService) {
  }

  public ngOnInit(): void {
    if (this.authService.checkRoles([RoleEnum.GENERAL_MANAGER])) {
      this.salaryStateService.find<SalaryDto>().subscribe((payslip) => {
        this.payslip = payslip;
        this.payslipLoading = false;
      }, () => this.payslipLoading = false);
    }
  }

}
