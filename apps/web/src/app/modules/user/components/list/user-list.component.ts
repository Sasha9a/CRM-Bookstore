import { Component, OnInit } from '@angular/core';
import { ShopDto } from "@crm/shared/dtos/shop/shop.dto";
import { UserDto } from "@crm/shared/dtos/user/user.dto";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { CrmTableColumn } from "@crm/web/core/models/crm-table-column";
import { QueryParamsService } from "@crm/web/core/services/query-params.service";
import { ShopStateService } from "@crm/web/core/services/shop/shop-state.service";
import { AuthService } from "@crm/web/core/services/user/auth.service";
import { UserStateService } from "@crm/web/core/services/user/user-state.service";

/** Компонент показывает список сотрудников */
@Component({
  selector: 'crm-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: []
})
export class UserListComponent implements OnInit {

  /** Сотрудники */
  public users: UserDto[];

  /** Грузится ли или нет */
  public loading = false;

  /** Столбцы таблицы */
  public itemColumns: CrmTableColumn[] = [
    {  },
    { label: 'ФИО', name: 'name', sort: 'name:string' },
    { label: 'Дата рождения', name: 'dateOfBirth', sort: 'dateOfBirth:date' },
    { label: 'Дата начала работы', name: 'startDate', sort: 'startDate:date' },
    { label: 'Магазин', name: 'shop', sort: 'shop.address:string' },
    { label: 'Телефон', name: 'telephone', sort: 'telephone:string' },
    { label: 'Адрес жительства', name: 'address', sort: 'address:string' },
    { label: 'Должность', name: 'position', sort: 'position:string' }
  ];

  /** Параметры адресной строки */
  public queryParams: Record<string, { value: any, toApi: boolean }> = {
    shop: {
      value: [],
      toApi: true
    }
  };

  /** Все фильтры */
  public filters = {
    shops: []
  };

  /** Выбранные фильтры */
  public selectedFilters = {
    shops: []
  }

  /** Генеральный директор или нет */
  public isGeneralRole = false;

  public constructor(private readonly userStateService: UserStateService,
                     private readonly shopStateService: ShopStateService,
                     private readonly queryParamsService: QueryParamsService,
                     private readonly authService: AuthService) { }

  public ngOnInit(): void {
    this.loading = true;

    this.isGeneralRole = this.authService.checkRoles([RoleEnum.GENERAL_MANAGER]);

    this.queryParams = this.queryParamsService.getFilteredQueryParams(this.queryParams);
    this.queryParamsService.setQueryParams(this.queryParams);

    this.shopStateService.find<ShopDto>().subscribe((data) => {
      this.filters.shops = data;
      this.selectedFilters = this.queryParamsService.getFilteredEntities(this.filters, this.queryParams);
      this.loadUsers();
    });

  }

  /** Функция загружает данные */
  public loadUsers() {
    this.loading = true;

    this.queryParamsService.setQueryParam(this.queryParams, 'shop', this.selectedFilters.shops?.map((shop) => shop._id));

    this.userStateService.find<UserDto>(this.queryParamsService.parseQueryParamsForApi(this.queryParams)).subscribe((data) => {
      this.users = data;
      this.loading = false;
    }, () => this.loading = false);
  }

  /** Функция типизирует переменную
   * @param user сотрудник
   * @return возвращает сотрудника */
  public toUser(user: any): UserDto {
    return user as UserDto;
  }

}
