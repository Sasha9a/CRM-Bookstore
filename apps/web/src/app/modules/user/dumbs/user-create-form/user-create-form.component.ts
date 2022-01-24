import { Component, Input } from '@angular/core';
import { ShopDto } from "@crm/shared/dtos/shop/shop.dto";
import { UserCreateFormDto } from "@crm/shared/dtos/user/user.create.form.dto";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { ErrorService } from "@crm/web/core/services/error.service";
import { UserPasswordService } from "@crm/web/core/services/user/user-password.service";
import { BaseFormComponent } from "@crm/web/shared/dumbs/base-form/base-form.component";
import { RoleNamePipe } from "@crm/web/shared/pipes/role-name.pipe";

/** Компонент ввода данных пользователя */
@Component({
  selector: 'crm-user-create-form',
  templateUrl: './user-create-form.component.html',
  styleUrls: []
})
export class UserCreateFormComponent extends BaseFormComponent<UserCreateFormDto> {

  /** Данные пользователя */
  @Input() public user = new UserCreateFormDto();
  public dto = UserCreateFormDto;

  /** Список магазинов */
  @Input() public shops: ShopDto[] = [];

  /** Список ролей */
  public roles: any[] = [];

  /** Редактирование пользователя или нет */
  @Input() public isEdit = false;

  /** URL на который возвращать при отмене */
  @Input() public route: string;

  /** Показывать ли пароль */
  public showPassword = false;

  public constructor(public override readonly errorService: ErrorService,
                     public readonly userPasswordService: UserPasswordService,
                     private readonly roleNamePipe: RoleNamePipe) {
    super(errorService);

    Object.keys(RoleEnum).forEach((role) => {
      this.roles.push({
        name: this.roleNamePipe.transform(RoleEnum[role]),
        role: RoleEnum[role]
      });
    });
  }

  /** Присваивает роль к пользователю
   * @param roles Роли */
  public setRole(roles: any) {
    this.user.roles = roles.map((role) => role.role);
  }

}
