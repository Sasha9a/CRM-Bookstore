import { Component, OnInit } from '@angular/core';
import { SalaryFormDto } from "@crm/shared/dtos/salary/salary.form.dto";
import { SalaryInfoFormDto } from "@crm/shared/dtos/salary/salary.info.form.dto";
import { ShopDto } from "@crm/shared/dtos/shop/shop.dto";
import { UserDto } from "@crm/shared/dtos/user/user.dto";
import { ScheduleEnum } from "@crm/shared/enums/schedule.enum";
import { CrmTableColumn } from "@crm/web/core/models/crm-table-column";
import { ShopStateService } from "@crm/web/core/services/shop/shop-state.service";
import { UserStateService } from "@crm/web/core/services/user/user-state.service";
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

  /** Выбранный магазин */
  public selectedShop: ShopDto;

  /** Столбцы таблицы */
  public itemColumns: CrmTableColumn[] = [
    { label: 'ФИО', name: 'name', sort: 'user.name:string' },
    { label: 'Оклад', name: 'salary', sort: 'user.salary:number' },
    { label: 'Всего рабочих дней', name: 'daysWorkedAll', sort: 'daysWorkedAll:number', style: { 'max-width.px': 120 } },
    { label: 'Отработанные дни', name: 'daysWorked', sort: 'daysWorked:number', style: { 'max-width.px': 120 } },
    { label: 'Премия' },
    { label: 'Штраф' },
    { label: 'Болезнь (дней)' },
    { label: 'Отпуск (дней)' },
    { label: 'Описание' }
  ];

  public constructor(private readonly userStateService: UserStateService,
                     private readonly shopStateService: ShopStateService) { }

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
  }

  /** Функция записывает период в переменную
   * @param dates Период */
  public setDateRange(dates: [Date, Date]) {
    [this.salary.dateFrom, this.salary.dateTo] = dates;
    this.updateAnalyticTable();
  }

  /** Обновляет таблицу сотрудников */
  public updateSelectedUsers() {
    const selectedUsers = this.users.filter((user) => {
      return (this.selectedShop && user.shop?._id === this.selectedShop._id) || (!this.selectedShop && !user.shop);
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

    info.daysWorked = info.daysWorkedAll - (info.sickDays ?? 0) - (info.vacationDays ?? 0);
    if (info.daysWorked < 0) {
      info.daysWorked = 0;
    }
  }

  /** Функция типизирует переменную
   * @param info информация
   * @return возвращает информацию */
  public toInfo(info: any): SalaryInfoFormDto {
    return info as SalaryInfoFormDto;
  }

}
