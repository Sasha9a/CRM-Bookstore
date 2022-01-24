import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ShopDto } from "@crm/shared/dtos/shop/shop.dto";
import { UserEditFormDto } from "@crm/shared/dtos/user/user.edit.form.dto";
import { RoleEnum } from "@crm/shared/enums/role.enum";
import { ErrorService } from "@crm/web/core/services/error.service";
import { BaseFormComponent } from "@crm/web/shared/dumbs/base-form/base-form.component";
import { RoleNamePipe } from "@crm/web/shared/pipes/role-name.pipe";

/** Компонент ввода данных пользователя при редактировании */
@Component({
  selector: 'crm-user-edit-form',
  templateUrl: './user-edit-form.component.html',
  styleUrls: []
})
export class UserEditFormComponent extends BaseFormComponent<UserEditFormDto> implements OnChanges {

  /** Данные пользователя */
  @Input() public user = new UserEditFormDto();
  public dto = UserEditFormDto;

  /** Список магазинов */
  @Input() public shops: ShopDto[] = [];

  /** Директор магазина или нет, кто редактирует пользователя */
  @Input() public isDirector = false;

  /** Магазин директора */
  @Input() public shopDirector: ShopDto;

  /** Список ролей */
  public roles: any[] = [];

  /** Выбранные роли */
  public selectedRoles: any[] = [];

  /** URL на который возвращать при отмене */
  @Input() public route: string;

  public constructor(public override readonly errorService: ErrorService,
                     private readonly roleNamePipe: RoleNamePipe) {
    super(errorService);

    Object.keys(RoleEnum).forEach((role) => {
      this.roles.push({
        name: this.roleNamePipe.transform(RoleEnum[role]),
        role: RoleEnum[role]
      });
    });
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['user']?.currentValue) {
      this.selectedRoles = [];
      changes['user']?.currentValue.roles.forEach((role) => {
        this.selectedRoles.push({
          name: this.roleNamePipe.transform(RoleEnum[role]),
          role: RoleEnum[role]
        });
      });
    }
    if (changes['shopDirector']?.currentValue) {
      if (this.isDirector) {
        this.user.shop = this.shopDirector;
      }
    }
  }

  /** Присваивает роль к пользователю
   * @param roles Роли */
  public setRole(roles: any) {
    this.user.roles = roles.map((role) => role.role);
  }

}