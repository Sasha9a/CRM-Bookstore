import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ShopDto } from "@crm/shared/dtos/shop/shop.dto";
import { UserCreateFormDto } from "@crm/shared/dtos/user/user.create.form.dto";
import { UserDto } from "@crm/shared/dtos/user/user.dto";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { ErrorService } from "@crm/web/core/services/error.service";
import { ShopStateService } from "@crm/web/core/services/shop/shop-state.service";
import { AuthService } from "@crm/web/core/services/user/auth.service";
import { UserStateService } from "@crm/web/core/services/user/user-state.service";

/** Компонент создания пользователя */
@Component({
  selector: 'crm-user-add',
  templateUrl: './user-add.component.html',
  styleUrls: []
})
export class UserAddComponent implements OnInit {

  /** Пользователь */
  public user: UserCreateFormDto = new UserCreateFormDto();

  /** Грузится ли или нет */
  public loading = true;

  /** Список магазинов */
  public shops: ShopDto[] = [];

  /** Директор магазина или нет, кто создает пользователя */
  public isDirector = false;

  /** Магазин директора */
  public shopDirector: ShopDto;

  public constructor(private readonly shopStateService: ShopStateService,
                     private readonly userStateService: UserStateService,
                     private readonly authService: AuthService,
                     private readonly errorService: ErrorService,
                     private readonly router: Router) { }

  public ngOnInit(): void {
    this.shopStateService.find<ShopDto>().subscribe((data) => {
      this.shops = data;
      if (!this.authService.checkRoles([RoleEnum.GENERAL_MANAGER])
        && this.authService.checkRoles([RoleEnum.STORE_DIRECTOR])) {
        this.isDirector = true;
        this.shopDirector = this.authService.currentUser?.shop;
      }
      this.loading = false;
    });
  }

  /** Функция создает пользователя
   * @param body данные пользователя */
  public create(body: UserCreateFormDto) {
    this.loading = true;
    this.user = body;

    this.userStateService.create<UserCreateFormDto, UserDto>(body).subscribe(() => {
      this.loading = false;
      this.errorService.addSuccessMessage("Пользователь успешно создан");
      this.router.navigate(['/user']).catch(console.error);
    }, () => this.loading = false);
  }

}
