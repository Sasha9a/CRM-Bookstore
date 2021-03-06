import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { SalaryDto } from "@crm/shared/dtos/salary/salary.dto";
import { SalaryFormDto } from "@crm/shared/dtos/salary/salary.form.dto";
import { SalaryInfoFormDto } from "@crm/shared/dtos/salary/salary.info.form.dto";
import { ShopDto } from "@crm/shared/dtos/shop/shop.dto";
import { UserDto } from "@crm/shared/dtos/user/user.dto";
import { ScheduleEnum } from "@crm/shared/enums/schedule.enum";
import { CrmTableColumn } from "@crm/web/core/models/crm-table-column";
import { ErrorService } from "@crm/web/core/services/error.service";
import { SalaryStateService } from "@crm/web/core/services/salary/salary-state.service";
import { ShopStateService } from "@crm/web/core/services/shop/shop-state.service";
import { AuthService } from "@crm/web/core/services/user/auth.service";
import { UserStateService } from "@crm/web/core/services/user/user-state.service";
import { validate } from "@crm/web/core/services/validation/validate.service";
import { Moment } from "moment-timezone";
import * as moment from "moment-timezone";
import { forkJoin } from "rxjs";

/** Компонент создания акта о зарплатах */
@Component({
  selector: 'crm-salary-add',
  templateUrl: './salary-add.component.html',
  styleUrls: []
})
export class SalaryAddComponent implements OnInit {

  /** Данные зарплаты */
  public salary: SalaryFormDto = new SalaryFormDto();

  /** Ошибки при валидации данных в форме */
  public errors: Record<keyof SalaryFormDto, any[]>;

  /** Грузится ли или нет */
  public loading = true;

  /** Все сотрудники */
  public users: UserDto[];

  /** Все магазины */
  public shops: ShopDto[];

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
    { label: 'Отпуск за свой счет (дней)' },
    { label: 'Описание' }
  ];

  /** Крайний день в периоде */
  public maxDate = moment().toDate();

  /** Максимальные кол-во рабочих дней в месяце */
  public maxWorkDaysToMonth: Record<ScheduleEnum, number> = {
    FIVE: 0,
    SHIFT: 0
  };

  /** Сегодняшняя дата */
  public currentDate = moment().toDate();

  public constructor(private readonly userStateService: UserStateService,
                     private readonly shopStateService: ShopStateService,
                     private readonly salaryStateService: SalaryStateService,
                     private readonly errorService: ErrorService,
                     private readonly authService: AuthService,
                     private readonly router: Router) { }

  public ngOnInit(): void {
    forkJoin(
      this.userStateService.find<UserDto>(),
      this.shopStateService.find<ShopDto>()
    )
    .subscribe(([users, shops]) => {
      this.users = users;
      this.updateSelectedUsers();
      this.shops = shops;
      this.loading = false;
    }, () => this.loading = false);

    this.salary.date = moment().startOf('day').toDate();

    this.salary.employee = this.authService.currentUser;
  }

  /** Функция записывает период в переменную
   * @param dates Период */
  public setDateRange(dates: [Date, Date]) {
    [this.salary.dateFrom, this.salary.dateTo] = dates;
    this.updateMaxWorkDaysToMonth();
    this.updateAnalyticTable();
  }

  /** Обновляет таблицу сотрудников */
  public updateSelectedUsers() {
    const selectedUsers = this.users.filter((user) => {
      return (this.salary.shop && user.shop?._id === this.salary.shop._id) || (!this.salary.shop && !user.shop);
    });
    this.salary.info = [];
    selectedUsers.forEach((selectUser) => {
      const info = new SalaryInfoFormDto();
      info.user = selectUser;
      this.salary.info.push(info);
    });
    this.updateAnalyticTable();
  }

  /** Функция обновляет аналитику в таблице */
  public updateAnalyticTable() {
    this.salary.info.forEach((info) => {
      this.updateAnalyticUser(info);
    });
  }

  /** Функция обновляет аналитику в таблице для конкретного сотрудника
   * @param info информация */
  public updateAnalyticUser(info: SalaryInfoFormDto) {
    info.daysWorkedAll = 0;
    info.daysWorked = 0;
    if (info.user?.schedule === ScheduleEnum.FIVE && this.salary.dateFrom && this.salary.dateTo) {
      const dateTo = moment(this.salary.dateTo).clone().add(1, 'day');
      const dateFrom = moment(this.salary.dateFrom).isBefore(moment(info.user?.startDate)) ? moment(info.user?.startDate) : moment(this.salary.dateFrom);
      if (dateFrom) {
        for (const date = dateFrom.clone(); date.isBefore(dateTo, 'day'); date.add(1, 'day')) {
          if (Number(date.format('d')) >= 1 && Number(date.format('d')) <= 5) {
            info.daysWorkedAll++;
          }
        }
      }
    }
    if (info.user?.schedule === ScheduleEnum.SHIFT && this.salary.dateFrom && this.salary.dateTo) {
      let isWorked = true;
      const dateStart = moment(info.user?.startDate);
      let periodInfo;
      for (const date = dateStart.clone(); date.isBefore(this.salary.dateFrom, 'day'); date.add(2, 'day')) {
        periodInfo = {
          from: date,
          to: date.clone().add(1, 'day'),
          isWorked: isWorked
        };
        isWorked = !isWorked;
      }

      const dateTo = moment(this.salary.dateTo).clone().add(1, 'day');
      let dateFrom: Moment;
      if (moment(this.salary.dateFrom).isBefore(moment(info.user?.startDate))) {
        dateFrom = moment(info.user?.startDate);
      } else {
        if (periodInfo) {
          dateFrom = periodInfo.to.clone().add(1, 'day');
          if (periodInfo.isWorked) {
            if (periodInfo.to.isSame(moment(this.salary.dateFrom), 'day')) {
              info.daysWorkedAll++;
            } else if (periodInfo.to.isSame(moment(this.salary.dateFrom).clone().add(1, 'day'), 'day') && periodInfo.to.isBefore(dateTo, 'day')) {
              info.daysWorkedAll += 2;
            }
          }
        } else {
          dateFrom = moment(this.salary.dateFrom);
        }
      }
      if (dateFrom) {
        for (const date = dateFrom.clone(); date.isBefore(dateTo, 'day'); date.add(2, 'day')) {
          if (isWorked && date.clone().add(1, 'day').isBefore(dateTo, 'day')) {
            info.daysWorkedAll += 2;
          } else if (isWorked && !date.clone().add(1, 'day').isBefore(dateTo, 'day')) {
            info.daysWorkedAll++;
          }
          isWorked = !isWorked;
        }
      }
    }

    info.daysWorked = info.daysWorkedAll - (info.sickDays || 0) - (info.vacationDays || 0) - (info.vacationDaysNoExpense || 0);
    if (info.daysWorked < 0) {
      info.daysWorked = 0;
    }

    const salaryWithoutTaxes = (info.user?.salary || 0) / (this.maxWorkDaysToMonth[info.user?.schedule] || 0) * info.daysWorked;
    info.sickPay = (info.user?.salary || 0) * 0.87 / (this.maxWorkDaysToMonth[info.user?.schedule] || 0) * (info.sickDays || 0) * 0.4;
    info.vacationPay = (info.user?.salary || 0) * 0.87 / (this.maxWorkDaysToMonth[info.user?.schedule] || 0) * (info.vacationDays || 0) * 0.7;
    info.sumEmployee = salaryWithoutTaxes * 0.87 + (info.premium || 0) - (info.fine || 0) + (info.sickPay || 0) + (info.vacationPay || 0);
    info.sumTaxes = salaryWithoutTaxes + (salaryWithoutTaxes * 0.22) + (salaryWithoutTaxes * 0.051)
      + (salaryWithoutTaxes * 0.029) + (salaryWithoutTaxes * 0.002) + (info.premium || 0) - (info.fine || 0)
      + (info.sickPay || 0) + (info.vacationPay || 0);

    this.updateSum();
  }

  /** Функция обновляет данные о максимальном кол-ве рабочих дней в месяце */
  public updateMaxWorkDaysToMonth() {
    this.maxWorkDaysToMonth = {
      FIVE: 0,
      SHIFT: 0
    };
    const startMonth = moment(this.salary.dateFrom).startOf('month');
    const endMonth = moment(this.salary.dateFrom).endOf('month').add(1, 'day');

    for (const date = startMonth.clone(); date.isBefore(endMonth, 'day'); date.add(1, 'day')) {
      if (Number(date.format('d')) >= 1 && Number(date.format('d')) <= 5) {
        this.maxWorkDaysToMonth.FIVE++;
      }
    }

    let isWorked = true;
    for (const date = startMonth.clone(); date.isBefore(endMonth, 'day'); date.add(2, 'day')) {
      if (isWorked && date.clone().add(1, 'day').isBefore(endMonth, 'day')) {
        this.maxWorkDaysToMonth.SHIFT += 2;
      } else if (isWorked && !date.clone().add(1, 'day').isBefore(endMonth, 'day')) {
        this.maxWorkDaysToMonth.SHIFT++;
      }
      isWorked = !isWorked;
    }
  }

  /** Функция обновляет итоговую сумму */
  public updateSum() {
    this.salary.sum = 0;
    this.salary.info.forEach((info) => {
      this.salary.sum += (info.sumTaxes || 0) + (info.sickPay || 0) + (info.vacationPay || 0);
    });
  }

  /** Функция отслеживает выбранный период
   * @param dates период дат */
  public getDateInRange(dates: [Date, Date]) {
    if (dates[0] && !dates[1]) {
      const dateTo = moment(dates[0]).endOf('month');
      this.maxDate = dateTo.isBefore(moment()) ? dateTo.toDate() : moment().toDate();
    } else if (dates[0] && dates[1]) {
      this.maxDate = moment().toDate();
    }
  }

  /** Функция создает акт */
  public create() {
    this.loading = true;

    const { valid, errors } = validate(this.salary, SalaryFormDto);
    if (!valid) {
      this.errors = errors;
      this.errorService.errorValues<SalaryFormDto>(this.errors);
      console.log(this.errors);
      this.loading = false;
    } else {
      this.errors = null;

      this.salaryStateService.create<SalaryFormDto, SalaryDto>(this.salary).subscribe(() => {
        this.loading = false;
        this.errorService.addSuccessMessage("Акт о зарплате создан");
        this.router.navigate(['/']).catch(console.error);
      }, () => this.loading = false);
    }
  }

  /** Функция типизирует переменную
   * @param info информация
   * @return возвращает информацию */
  public toInfo(info: any): SalaryInfoFormDto {
    return info as SalaryInfoFormDto;
  }

}
