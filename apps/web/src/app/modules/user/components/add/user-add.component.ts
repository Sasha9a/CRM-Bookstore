import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ShopDto } from "@crm/shared/dtos/shop/shop.dto";
import { UserDto } from "@crm/shared/dtos/user/user.dto";
import { UserFormDto } from "@crm/shared/dtos/user/user.form.dto";
import { ErrorService } from "@crm/web/core/services/error.service";
import { ShopStateService } from "@crm/web/core/services/shop/shop-state.service";
import { UserStateService } from "@crm/web/core/services/user/user-state.service";

/** Компонент создания пользователя */
@Component({
  selector: 'crm-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: []
})
export class UserAddComponent implements OnInit {

  /** Грузится ли или нет */
  public loading = true;

  /** Список магазинов */
  public shops: ShopDto[] = [];

  public constructor(private readonly shopStateService: ShopStateService,
                     private readonly userStateService: UserStateService,
                     private readonly errorService: ErrorService,
                     private readonly router: Router) { }

  public ngOnInit(): void {
    this.shopStateService.find<ShopDto>().subscribe((data) => {
      this.shops = data;
      this.loading = false;
    });
  }

  /** Функция создает пользователя
   * @param body данные пользователя */
  public create(body: UserFormDto) {
    this.loading = true;

    this.userStateService.create<UserFormDto, UserDto>(body).subscribe(() => {
      this.loading = false;
      this.errorService.addSuccessMessage("Пользователь успешно создан");
      this.router.navigate(['/user']).catch(console.error);
    }, () => this.loading = false);
  }

}
