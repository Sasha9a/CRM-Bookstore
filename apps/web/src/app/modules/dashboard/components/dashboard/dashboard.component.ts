import { Component, OnInit } from '@angular/core';
import { ReceiptDto } from "@crm/shared/dtos/receipt/receipt.dto";
import { SalaryDto } from "@crm/shared/dtos/salary/salary.dto";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { ReceiptStateService } from "@crm/web/core/services/receipt/receipt-state.service";
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

  /** Чеки */
  public receipts: ReceiptDto[];

  /** Грузится ли таблица расчетных листов или нет */
  public payslipLoading = true;

  /** Грузится ли таблица чеков или нет */
  public receiptsLoading = true;

  public get RoleEnum() {
    return RoleEnum;
  }

  public constructor(private readonly salaryStateService: SalaryStateService,
                     private readonly receiptStateService: ReceiptStateService,
                     public readonly authService: AuthService) {
  }

  public ngOnInit(): void {
    if (this.authService.checkRoles([RoleEnum.GENERAL_MANAGER])) {
      this.salaryStateService.find<SalaryDto>().subscribe((payslip) => {
        this.payslip = payslip;
        this.payslipLoading = false;
      }, () => this.payslipLoading = false);
    }

    if (this.authService.checkRoles([RoleEnum.GENERAL_MANAGER, RoleEnum.STORE_DIRECTOR])) {
      this.receiptStateService.find<ReceiptDto>().subscribe((receipts) => {
        this.receipts = receipts;
        this.receiptsLoading = false;
      }, () => this.receiptsLoading = false);
    }
  }

}
