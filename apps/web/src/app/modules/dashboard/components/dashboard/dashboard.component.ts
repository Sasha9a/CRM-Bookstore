import { Component, OnInit } from '@angular/core';
import { ReceiptDto } from "@crm/shared/dtos/receipt/receipt.dto";
import { SalaryDto } from "@crm/shared/dtos/salary/salary.dto";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { ReceiptStateService } from "@crm/web/core/services/receipt/receipt-state.service";
import { SalaryStateService } from "@crm/web/core/services/salary/salary-state.service";
import { AuthService } from "@crm/web/core/services/user/auth.service";
import * as moment from "moment-timezone";

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
    const datePeriod: [Date, Date] = [
      moment().startOf('month').toDate(),
      moment().endOf('month').toDate()
    ];

    if (this.authService.checkRoles([RoleEnum.GENERAL_MANAGER])) {
      this.loadPayslip(datePeriod);
    }

    if (this.authService.checkRoles([RoleEnum.GENERAL_MANAGER, RoleEnum.STORE_DIRECTOR])) {
      this.loadReceipts(datePeriod);
    }
  }

  /** Функция загружает данные о расчетных счетах
   * @param queryParams параметры фильтрации */
  public loadPayslip(queryParams?: [Date, Date]) {
    this.payslipLoading = true;

    let params;
    if (queryParams) {
      params = {
        filter: `{"date":{"$gte":"${moment(queryParams[0]).toISOString()}","$lte":"${moment(queryParams[1]).toISOString()}"}}`
      }
    }
    this.salaryStateService.find<SalaryDto>(params).subscribe((payslip) => {
      this.payslip = payslip;
      this.payslipLoading = false;
    }, () => this.payslipLoading = false);
  }

  /** Функция загружает данные о чеках
   * @param queryParams параметры фильтрации */
  public loadReceipts(queryParams?: [Date, Date]) {
    this.receiptsLoading = true;

    let params;
    if (queryParams) {
      params = {
        filter: `{"date":{"$gte":"${moment(queryParams[0]).toISOString()}","$lte":"${moment(queryParams[1]).toISOString()}"}}`
      }
    }

    this.receiptStateService.find<ReceiptDto>(params).subscribe((receipts) => {
      this.receipts = receipts;
      this.receiptsLoading = false;
    }, () => this.receiptsLoading = false);
  }

}
