import { Component, OnInit } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { ShopDto } from "@crm/shared/dtos/shop/shop.dto";
import { UserDto } from "@crm/shared/dtos/user/user.dto";
import { UserEditFormDto } from "@crm/shared/dtos/user/user.edit.form.dto";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { ErrorService } from "@crm/web/core/services/error.service";
import { ShopStateService } from "@crm/web/core/services/shop/shop-state.service";
import { AuthService } from "@crm/web/core/services/user/auth.service";
import { UserStateService } from "@crm/web/core/services/user/user-state.service";

/** Компонент редактирования пользователя */
@Component({
  selector: 'crm-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: []
})
export class UserEditComponent implements OnInit {

  /** Грузится ли или нет */
  public loading = true;

  /** ID пользователя */
  public userId: string;

  /** Пользователь */
  public user: UserDto;

  /** Список магазинов */
  public shops: ShopDto[] = [];

  /** Директор магазина или нет, кто редактирует пользователя */
  public isDirector = false;

  /** Магазин директора */
  public shopDirector: ShopDto;

  public constructor(private readonly shopStateService: ShopStateService,
                     private readonly userStateService: UserStateService,
                     private readonly errorService: ErrorService,
                     private readonly authService: AuthService,
                     private readonly route: ActivatedRoute,
                     private readonly router: Router,
                     private readonly title: Title) { }

  public ngOnInit(): void {
    this.userId = this.route.snapshot.params['id'];

    if (!this.userId) {
      return this.errorService.addCustomError('Ошибка', 'Произошла ошибка, вернитесь на главную и попробуйте снова.');
    }

    this.userStateService.findById<UserDto>(this.userId).subscribe((data) => {
      if (!this.authService.checkRoles([RoleEnum.GENERAL_MANAGER])
        && this.authService.checkRoles([RoleEnum.STORE_DIRECTOR])) {
        this.isDirector = true;
        this.shopDirector = this.authService.currentUser?.shop;
      }
      if (this.authService.checkRoles([RoleEnum.GENERAL_MANAGER]) || (
        this.authService.checkRoles([RoleEnum.STORE_DIRECTOR]) && this.authService.currentUser?.shop?._id === data?.shop?._id
      )) {
        this.user = data;
        this.title.setTitle(`${this.user.name} - CRM`);
      } else {
        this.errorService.addCustomError('Ошибка', 'Произошла ошибка, вернитесь на главную и попробуйте снова.');
      }
      this.loading = false;
    });

    this.shopStateService.find<ShopDto>().subscribe((data) => {
      this.shops = data;
    });
  }

  /** Функция Изменяет пользователя
   * @param body данные пользователя */
  public update(body: UserEditFormDto) {
    this.loading = true;

    this.userStateService.update<UserEditFormDto, UserDto>(this.userId, body).subscribe(() => {
      this.loading = false;
      this.errorService.addSuccessMessage("Пользователь изменен");
      this.router.navigate(['/user/card', this.userId]).catch(console.error);
    }, () => this.loading = false);
  }

}
