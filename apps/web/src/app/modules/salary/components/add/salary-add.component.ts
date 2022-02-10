import { Component, OnInit } from '@angular/core';
import { SalaryFormDto } from "@crm/shared/dtos/salary/salary.form.dto";
import { SalaryInfoFormDto } from "@crm/shared/dtos/salary/salary.info.form.dto";
import { ShopDto } from "@crm/shared/dtos/shop/shop.dto";
import { UserDto } from "@crm/shared/dtos/user/user.dto";
import { CrmTableColumn } from "@crm/web/core/models/crm-table-column";
import { ShopStateService } from "@crm/web/core/services/shop/shop-state.service";
import { UserStateService } from "@crm/web/core/services/user/user-state.service";
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
    { label: 'ФИО', name: 'name', sort: 'name:string' },
    { label: 'Премия', name: 'premium', sort: 'premium:number' },
    { label: 'Штраф', name: 'fine', sort: 'fine:number' },
    { label: 'Болезнь (дней)', name: 'sickDays', sort: 'sickDays:number' },
    { label: 'Отпуск (дней)', name: 'vacationDays', sort: 'vacationDays:number' },
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
  }

  /** Обновляет таблицу */
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
  }

  /** Функция типизирует переменную
   * @param info информация
   * @return возвращает информацию */
  public toInfo(info: any): SalaryInfoFormDto {
    return info as SalaryInfoFormDto;
  }

}
